// Rating Service for Healthcare Providers
// This service handles rating and review operations

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

class RatingService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Create a new rating
  async createRating(ratingData: Omit<Rating, 'id' | 'date' | 'helpful'>): Promise<Rating> {
    try {
      // In ERPNext, we can create a custom DocType for ratings
      const response = await fetch(`${this.baseUrl}/api/resource/Healthcare Provider Rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${this.apiKey}`,
        },
        body: JSON.stringify({
          provider_id: ratingData.providerId,
          patient_id: ratingData.patientId,
          patient_name: ratingData.patientName,
          rating: ratingData.rating,
          review: ratingData.review,
          verified: ratingData.verified,
          communication_rating: ratingData.categories.communication,
          professionalism_rating: ratingData.categories.professionalism,
          wait_time_rating: ratingData.categories.waitTime,
          facilities_rating: ratingData.categories.facilities,
          overall_rating: ratingData.categories.overall,
          service_type: ratingData.serviceType,
          would_recommend: ratingData.wouldRecommend ? 1 : 0,
          appointment_id: ratingData.appointmentId,
          helpful_count: 0,
          creation: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create rating');
      }

      const result = await response.json();
      return this.mapERPNextToRating(result.data);
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  }

  // Get ratings for a specific provider
  async getProviderRatings(providerId: string, limit: number = 50): Promise<Rating[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/resource/Healthcare Provider Rating?filters=[["provider_id","=","${providerId}"]]&limit=${limit}&order_by=creation desc`,
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }

      const result = await response.json();
      return result.data.map(this.mapERPNextToRating);
    } catch (error) {
      console.error('Error fetching provider ratings:', error);
      return [];
    }
  }

  // Get rating statistics for a provider
  async getProviderRatingStats(providerId: string): Promise<RatingStats> {
    try {
      const ratings = await this.getProviderRatings(providerId, 1000); // Get all ratings for stats
      
      if (ratings.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: [0, 0, 0, 0, 0],
          categoryAverages: {
            communication: 0,
            professionalism: 0,
            waitTime: 0,
            facilities: 0,
            overall: 0
          },
          recommendationPercentage: 0
        };
      }

      // Calculate average rating
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;

      // Calculate rating distribution
      const distribution = [0, 0, 0, 0, 0];
      ratings.forEach(rating => {
        if (rating.rating >= 1 && rating.rating <= 5) {
          distribution[rating.rating - 1]++;
        }
      });

      // Calculate category averages
      const categoryTotals = {
        communication: 0,
        professionalism: 0,
        waitTime: 0,
        facilities: 0,
        overall: 0
      };

      ratings.forEach(rating => {
        categoryTotals.communication += rating.categories.communication;
        categoryTotals.professionalism += rating.categories.professionalism;
        categoryTotals.waitTime += rating.categories.waitTime;
        categoryTotals.facilities += rating.categories.facilities;
        categoryTotals.overall += rating.categories.overall;
      });

      const categoryAverages = {
        communication: categoryTotals.communication / ratings.length,
        professionalism: categoryTotals.professionalism / ratings.length,
        waitTime: categoryTotals.waitTime / ratings.length,
        facilities: categoryTotals.facilities / ratings.length,
        overall: categoryTotals.overall / ratings.length
      };

      // Calculate recommendation percentage
      const recommendCount = ratings.filter(rating => rating.wouldRecommend).length;
      const recommendationPercentage = (recommendCount / ratings.length) * 100;

      return {
        averageRating,
        totalRatings: ratings.length,
        ratingDistribution: distribution,
        categoryAverages,
        recommendationPercentage
      };
    } catch (error) {
      console.error('Error calculating rating stats:', error);
      throw error;
    }
  }

  // Mark a rating as helpful
  async markRatingHelpful(ratingId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/resource/Healthcare Provider Rating/${ratingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${this.apiKey}`,
        },
        body: JSON.stringify({
          helpful_count: { increment: 1 }
        })
      });
    } catch (error) {
      console.error('Error marking rating as helpful:', error);
      throw error;
    }
  }

  // Report a rating
  async reportRating(ratingId: string, reason: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/resource/Rating Report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${this.apiKey}`,
        },
        body: JSON.stringify({
          rating_id: ratingId,
          reason: reason,
          status: 'Open',
          creation: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error reporting rating:', error);
      throw error;
    }
  }

  // Check if patient can rate a provider (has had an appointment)
  async canPatientRate(patientId: string, providerId: string): Promise<boolean> {
    try {
      // Check if patient has completed appointments with this provider
      const response = await fetch(
        `${this.baseUrl}/api/resource/Patient Appointment?filters=[["patient","=","${patientId}"],["practitioner","=","${providerId}"],["status","=","Closed"]]&limit=1`,
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
          }
        }
      );

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.data.length > 0;
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
      return false;
    }
  }

  // Get patient's rating for a specific provider
  async getPatientRating(patientId: string, providerId: string): Promise<Rating | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/resource/Healthcare Provider Rating?filters=[["patient_id","=","${patientId}"],["provider_id","=","${providerId}"]]&limit=1`,
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data.length > 0 ? this.mapERPNextToRating(result.data[0]) : null;
    } catch (error) {
      console.error('Error fetching patient rating:', error);
      return null;
    }
  }

  // Helper method to map ERPNext data to Rating interface
  private mapERPNextToRating(erpData: any): Rating {
    return {
      id: erpData.name,
      providerId: erpData.provider_id,
      patientId: erpData.patient_id,
      patientName: erpData.patient_name,
      rating: erpData.rating,
      review: erpData.review,
      date: erpData.creation,
      verified: erpData.verified,
      helpful: erpData.helpful_count || 0,
      categories: {
        communication: erpData.communication_rating || 0,
        professionalism: erpData.professionalism_rating || 0,
        waitTime: erpData.wait_time_rating || 0,
        facilities: erpData.facilities_rating || 0,
        overall: erpData.overall_rating || 0
      },
      serviceType: erpData.service_type,
      wouldRecommend: erpData.would_recommend === 1,
      appointmentId: erpData.appointment_id
    };
  }
}

// Export singleton instance
export const ratingService = new RatingService(
  process.env.EXPO_PUBLIC_ERPNEXT_URL || 'https://demo.erpnext.com',
  process.env.EXPO_PUBLIC_ERPNEXT_API_KEY || 'demo_api_key'
);

export default RatingService;