import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON reviews file path
  const REVIEWS_PATH = path.join(__dirname, 'src/data/reviews-all.json');

  async function performSync() {
    try {
      let allComments: any[] = [];
      let page = 1;
      let hasMore = true;

      console.log('Fetching latest reviews from Zaih (Full Sync)...');
      
      while (hasMore) {
        // Zaih API pagination typically uses ?page=X
        const url = `https://www.zaih.com/falcon/meet_api/v1/mentors/2bllbjjbq3k/comments?page=${page}`;
        const response = await fetch(url);
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
          
          // If the page has fewer than expected items (e.g. 20), we reached the end
          // Or if we've reached a reasonable page limit
          if (comments.length < 5 || page > 25) { 
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allComments.length > 0) {
        await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
        await fs.writeFile(REVIEWS_PATH, JSON.stringify(allComments, null, 2));
        console.log(`Successfully synced ${allComments.length} reviews to ${REVIEWS_PATH}`);
        return allComments.length;
      }
      return 0;
    } catch (error) {
      console.error('Error during Zaih sync:', error);
      throw error;
    }
  }

  // API to get reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const data = await fs.readFile(REVIEWS_PATH, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error('Error reading reviews:', error);
      // If file doesn't exist, try to sync first
      try {
        await performSync();
        const data = await fs.readFile(REVIEWS_PATH, 'utf-8');
        res.json(JSON.parse(data));
      } catch (err) {
        res.status(500).json({ error: 'Failed to load reviews' });
      }
    }
  });

  // API to trigger sync (Ethan can call this)
  app.post('/api/sync-reviews', async (req, res) => {
    try {
      const count = await performSync();
      res.json({ message: 'Sync successful', count });
    } catch (error) {
      res.status(500).json({ error: 'Sync failed' });
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
