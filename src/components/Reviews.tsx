import React, { useState } from 'react';
import Section from './Section';
import reviewsData from '../data/reviews-all.json';
import { Quote, Star, ChevronDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface ZaihComment {
  id: number;
  comments: string;
  format_time: string;
  commentor: {
    name: string;
    avatar: string;
  };
  topic: {
    title: string;
  };
}

const ITEMS_PER_PAGE = 9;

function ReviewCard({ review }: { review: ZaihComment; key?: React.Key }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = review.comments.length > 180;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-8 bg-zinc-50 border border-zinc-100 rounded-lg flex flex-col h-full hover:border-zinc-300 transition-colors"
    >
      <div className="flex items-center gap-3 mb-6">
        <img
          src={review.commentor.avatar}
          alt={review.commentor.name}
          className="w-10 h-10 rounded-full border border-zinc-200 grayscale"
          referrerPolicy="no-referrer"
        />
        <div>
          <h4 className="text-sm font-bold text-zinc-900 leading-none mb-1">
            {review.commentor.name.trim()}
          </h4>
          <p className="text-[10px] text-zinc-400 font-mono italic">
            {review.format_time}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <Quote className="text-zinc-200 mb-2" size={24} />
        <p className={`text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-6' : ''}`}>
          {review.comments}
        </p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-300 transition-all"
          >
            {isExpanded ? t('reviews.less') : t('reviews.more')}
          </button>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate">
          {review.topic?.title || 'Consultation'}
        </p>
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [allReviews, setAllReviews] = useState<ZaihComment[]>(reviewsData as ZaihComment[]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setAllReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/sync-reviews', { method: 'POST' });
      if (response.ok) {
        await fetchReviews();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const totalPages = Math.ceil(allReviews.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleReviews = allReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let lastShown = 0;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        if (lastShown && i - lastShown !== 1) {
          pages.push(<span key={`dots-${i}`} className="px-2 text-zinc-300">...</span>);
        }
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-9 h-9 text-[10px] font-bold transition-all border ${
              currentPage === i 
                ? 'bg-zinc-900 text-white border-zinc-900' 
                : 'text-zinc-500 border-zinc-100 hover:border-zinc-900'
            }`}
          >
            {i}
          </button>
        );
        lastShown = i;
      }
    }
    return pages;
  };

  return (
    <Section id="reviews" title={t('reviews.title')} subtitle={t('reviews.subtitle')}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
        <AnimatePresence mode="popLayout">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 h-9 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-transparent"
          >
            {t('reviews.prev')}
          </button>
          
          <div className="flex gap-1">
            {renderPageNumbers()}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 h-9 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-transparent"
          >
            {t('reviews.next')}
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] italic">
            {t('reviews.stats.total')}: {allReviews.length} &bull; {(t('nav.media') || 'Page').split('/')[0]} {currentPage} / {totalPages}
          </p>
          
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 transition-all disabled:opacity-50 group"
          >
            <RefreshCw size={12} className={`${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {syncing ? 'Syncing...' : 'Sync with Zaih'}
          </button>
        </div>
      </div>
    </Section>
  );
}
