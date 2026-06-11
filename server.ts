import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  const PORT = 3000;

  // JSON reviews file path
  const REVIEWS_PATH = path.join(__dirname, 'src/data/reviews-all.json');

  // In-memory cache to guarantee persistence on read-only environments like Vercel
  let cachedReviews: any[] | null = null;

  async function performSync() {
    try {
      let allComments: any[] = [];
      let page = 1;
      let hasMore = true;

      console.log('Fetching latest reviews from Zaih (Full Sync)...');
      
      while (hasMore) {
        // Zaih API pagination typically uses ?page=X
        const url = `https://www.zaih.com/falcon/meet_api/v1/mentors/2bllbjjbq3k/comments?page=${page}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!response.ok) {
          console.error(`Failed to fetch page ${page}: ${response.status}`);
          break;
        }

        const data = await response.json();
        const comments = Array.isArray(data) ? data : (data.comments || data.results || []);

        if (Array.isArray(comments) && comments.length > 0) {
          allComments = [...allComments, ...comments];
          console.log(`Fetched page ${page}, total so far: ${allComments.length}`);
          page++;
          
          // If the page has fewer than expected items (e.g. 5), we reached the end
          // Or if we've reached a reasonable page limit
          if (comments.length < 5 || page > 25) { 
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allComments.length > 0) {
        // Update in-memory cache first so it's instantly available and updated
        cachedReviews = allComments;

        // Try writing to local file system for persistent local storage, but handle read-only environments gracefully
        try {
          await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
          await fs.writeFile(REVIEWS_PATH, JSON.stringify(allComments, null, 2));
          console.log(`Successfully persisted ${allComments.length} reviews to disk: ${REVIEWS_PATH}`);
        } catch (fsError) {
          console.warn('File system write ignored (possibly running in a read-only serverless environment like Vercel). In-memory cache has been updated.', fsError);
        }
        return allComments.length;
      }
      return cachedReviews ? cachedReviews.length : 0;
    } catch (error) {
      console.error('Error during Zaih sync:', error);
      throw error;
    }
  }

  // API to get reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      // If we have an in-memory cache, serve it immediately (very fast, no disk I/O)
      if (cachedReviews && cachedReviews.length > 0) {
        return res.json(cachedReviews);
      }

      // Try to read from disk
      try {
        const data = await fs.readFile(REVIEWS_PATH, 'utf-8');
        cachedReviews = JSON.parse(data);
        return res.json(cachedReviews);
      } catch (readError) {
        console.log('No reviews on disk, triggering performSync...');
        // If file doesn't exist, try to sync first
        await performSync();
        if (cachedReviews) {
          return res.json(cachedReviews);
        } else {
          throw new Error('Sync returned empty results');
        }
      }
    } catch (error) {
      console.error('Error reading reviews:', error);
      res.status(500).json({ error: 'Failed to load reviews' });
    }
  });

  // API to trigger sync (Ethan can call this)
  app.post('/api/sync-reviews', async (req, res) => {
    try {
      // If a SYNC_SECRET environment variable is configured, enforce authorization (anti-impersonation)
      const syncSecret = process.env.SYNC_SECRET;
      if (syncSecret) {
        const authHeader = req.headers.authorization;
        const queryToken = req.query.token;
        const token = authHeader ? authHeader.replace(/^Bearer\s+/, '') : queryToken;

        if (!token || token !== syncSecret) {
          console.warn('Unauthorized sync attempt blocked.');
          return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }
      }

      const count = await performSync();
      res.json({ message: 'Sync successful', count });
    } catch (error) {
      res.status(500).json({ error: 'Sync failed' });
    }
  });

  // Cached locales to optimize reads and support read-only file systems gracefully
  let cachedLocales: { [key: string]: any } | null = null;

  async function loadLocales() {
    if (cachedLocales) return cachedLocales;
    try {
      const [enData, zhCNData, zhTWData] = await Promise.all([
        fs.readFile(path.join(__dirname, 'src/locales/en.json'), 'utf-8').then(JSON.parse).catch(() => ({})),
        fs.readFile(path.join(__dirname, 'src/locales/zh-CN.json'), 'utf-8').then(JSON.parse).catch(() => ({})),
        fs.readFile(path.join(__dirname, 'src/locales/zh-TW.json'), 'utf-8').then(JSON.parse).catch(() => ({}))
      ]);
      cachedLocales = {
        en: enData,
        'zh-CN': zhCNData,
        'zh-TW': zhTWData
      };
      return cachedLocales;
    } catch (err) {
      console.error('Error loading locales from files', err);
      return {};
    }
  }

  // API to get all locale files
  app.get('/api/locales', async (req, res) => {
    try {
      const locales = await loadLocales();
      res.json(locales);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load locales' });
    }
  });

  // API to save all locale files
  app.post('/api/save-locales', async (req, res) => {
    try {
      const { en, 'zh-CN': zhCN, 'zh-TW': zhTW, password } = req.body;
      
      const adminPassword = process.env.ADMIN_PASSWORD || 'ethan2026';
      if (password !== adminPassword) {
        return res.status(401).json({ error: 'Unauthorized save attempt' });
      }

      if (!en || !zhCN || !zhTW) {
        return res.status(400).json({ error: 'Invalid locales payload' });
      }

      cachedLocales = { en, 'zh-CN': zhCN, 'zh-TW': zhTW };

      // Write to disk
      try {
        await Promise.all([
          fs.writeFile(path.join(__dirname, 'src/locales/en.json'), JSON.stringify(en, null, 2)),
          fs.writeFile(path.join(__dirname, 'src/locales/zh-CN.json'), JSON.stringify(zhCN, null, 2)),
          fs.writeFile(path.join(__dirname, 'src/locales/zh-TW.json'), JSON.stringify(zhTW, null, 2))
        ]);
        console.log('Successfully saved and persisted locales on disk');
      } catch (writeErr) {
        console.warn('Failed to write locales to disk (possibly read-only environment). Serving from memory-cache instead.', writeErr);
      }

      res.json({ message: 'Saved successfully' });
    } catch (error) {
      console.error('Failed to save locales', error);
      res.status(500).json({ error: 'Failed to save locales' });
    }
  });

  // API for admin login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'ethan2026';
    if (password === adminPassword) {
      res.json({ success: true, token: 'admin-authorized-token-2026' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    // Initial sync on startup
    performSync().catch(console.error);
  });

  // Simple daily "cron" (once every 24 hours)
  setInterval(() => {
    console.log('Daily sync task running...');
    performSync().catch(console.error);
  }, 24 * 60 * 60 * 1000);
}

startServer();
