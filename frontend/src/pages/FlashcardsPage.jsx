import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Layers,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  CheckCircle2,
  Bookmark,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { TopicBadge } from '../components/Badges';
import { LoadingSpinner, EmptyState } from '../components/StateFeedback';

const FlashcardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterTopic, setFilterTopic] = useState('all');

  const [searchParams] = useSearchParams();
  const docIdParam = searchParams.get('doc');

  const { addToast } = useToast();

  const fetchFlashcards = async () => {
    try {
      const url = docIdParam ? `/flashcards?document_id=${docIdParam}` : '/flashcards';
      const res = await api.get(url);
      setCards(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load flashcards', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [docIdParam]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, currentIndex]);

  const filteredCards = cards.filter((c) => {
    if (filterTopic === 'all') return true;
    return c.topic === filterTopic;
  });

  const topics = Array.from(new Set(cards.map((c) => c.topic))).filter(Boolean);

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(filteredCards.length, 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(filteredCards.length, 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    addToast('Flashcards shuffled!', 'info');
  };

  const handleMarkStatus = async (known) => {
    if (!currentCard) return;
    try {
      await api.put(`/flashcards/${currentCard.id}`, { known });
      setCards((prev) =>
        prev.map((c) =>
          c.id === currentCard.id ? { ...c, known, review_required: !known } : c
        )
      );
      addToast(known ? 'Marked as Known' : 'Marked for Review', 'success');
      handleNext();
    } catch (err) {
      addToast('Failed to update flashcard', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading 3D flashcards..." />;
  }

  const knownCount = filteredCards.filter((c) => c.known).length;
  const reviewCount = filteredCards.length - knownCount;
  const masteryPercent = Math.round((knownCount / Math.max(filteredCards.length, 1)) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            3D Spaced Repetition Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active recall cards with flip animations to accelerate retention
          </p>
        </div>

        {/* Topic filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterTopic}
            onChange={(e) => {
              setFilterTopic(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Topics ({cards.length})</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={handleShuffle} icon={Shuffle}>
            Shuffle
          </Button>
        </div>
      </div>

      {/* Progress & Mastery Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Card {filteredCards.length > 0 ? currentIndex + 1 : 0} of {filteredCards.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
              {knownCount} Known
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px]">
              {reviewCount} To Review
            </span>
          </div>
        </div>

        <div className="w-32 hidden sm:block">
          <ProgressBar progress={masteryPercent} colorScheme="auto" size="sm" />
        </div>
      </div>

      {/* 3D Flashcard Display */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-6">
          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-8 sm:p-12 bg-white dark:bg-darkCard border-2 border-slate-200/80 dark:border-darkBorder shadow-xl flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <TopicBadge topic={currentCard.topic} size="sm" />
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Click or Space to Flip
                  </span>
                </div>

                <div className="max-w-md my-auto space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
                    Question / Concept
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-400">
                  Hint: Formulate your answer before flipping the card
                </p>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-primary-900 via-slate-900 to-indigo-950 text-white border-2 border-primary-500/40 shadow-xl shadow-primary-500/10 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between text-xs text-primary-200">
                  <span className="font-semibold">{currentCard.topic}</span>
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Click to flip back
                  </span>
                </div>

                <div className="max-w-md my-auto space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Explanation / Answer
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {currentCard.known ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Marked as Known
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Bookmark className="w-4 h-4" /> Marked for Review
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrev}
                icon={ArrowLeft}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsFlipped(!isFlipped)}
                icon={RotateCw}
                className="flex-1 sm:flex-none"
              >
                Flip
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleNext}
                className="flex-1 sm:flex-none"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Mastery Mark Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleMarkStatus(false)}
                className="flex-1 sm:flex-none text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                icon={Bookmark}
              >
                Need Review
              </Button>
              <Button
                variant="success"
                size="md"
                onClick={() => handleMarkStatus(true)}
                className="flex-1 sm:flex-none"
                icon={CheckCircle2}
              >
                Know It
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Flashcards Available"
          description="Upload a document or select another topic filter to start active recall practice."
        />
      )}
    </div>
  );
};

export default FlashcardsPage;
