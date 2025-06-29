import { useState, useEffect } from 'react';
import { ratingService } from '@/services/ratingService';

interface Rating {
  id: string;
  providerId: string;
  patientId: string;
  patientName: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
  helpful: number;
  categories: {
    communication: number;
    professionalism: number;
    waitTime: number;
    facilities: number;
    overall: number;
  };
  serviceType: string;
  wouldRecommend: boolean;
  appointmentId?: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: number[];
  categoryAverages: {
    communication: number;
    professionalism: number;
    waitTime: number;
    facilities: number;
    overall: number;
  };
  recommendationPercentage: number;
}

export function useProviderRatings(providerId: string) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ratingsData, statsData] = await Promise.all([
        ratingService.getProviderRatings(providerId),
        ratingService.getProviderRatingStats(providerId)
      ]);
      
      setRatings(ratingsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (ratingData: Omit<Rating, 'id' | 'date' | 'helpful'>) => {
    setLoading(true);
    setError(null);
    try {
      const newRating = await ratingService.createRating(ratingData);
      setRatings(prev => [newRating, ...prev]);
      
      // Refresh stats
      const updatedStats = await ratingService.getProviderRatingStats(providerId);
      setStats(updatedStats);
      
      return newRating;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (ratingId: string) => {
    try {
      await ratingService.markRatingHelpful(ratingId);
      setRatings(prev => 
        prev.map(rating => 
          rating.id === ratingId 
            ? { ...rating, helpful: rating.helpful + 1 }
            : rating
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as helpful');
    }
  };

  const reportRating = async (ratingId: string, reason: string) => {
    try {
      await ratingService.reportRating(ratingId, reason);
      // Optionally remove from local state or mark as reported
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report rating');
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchRatings();
    }
  }, [providerId]);

  return {
    ratings,
    stats,
    loading,
    error,
    submitRating,
    markHelpful,
    reportRating,
    refetch: fetchRatings
  };
}

export function usePatientRatingEligibility(patientId: string, providerId: string) {
  const [canRate, setCanRate] = useState(false);
  const [existingRating, setExistingRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const [eligible, existing] = await Promise.all([
        ratingService.canPatientRate(patientId, providerId),
        ratingService.getPatientRating(patientId, providerId)
      ]);
      
      setCanRate(eligible && !existing);
      setExistingRating(existing);
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
      setCanRate(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId && providerId) {
      checkEligibility();
    }
  }, [patientId, providerId]);

  return {
    canRate,
    existingRating,
    loading,
    refetch: checkEligibility
  };
}