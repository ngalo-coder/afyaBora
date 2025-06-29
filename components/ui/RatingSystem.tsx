import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Star, User, Calendar, ThumbsUp, MessageCircle, Flag } from 'lucide-react-native';

interface Rating {
  id: string;
  patientName: string;
  patientId: string;
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
}

interface RatingSystemProps {
  providerId: string;
  providerName: string;
  averageRating: number;
  totalRatings: number;
  ratings: Rating[];
  onSubmitRating?: (rating: Partial<Rating>) => void;
  canRate?: boolean;
}

export function RatingSystem({
  providerId,
  providerName,
  averageRating,
  totalRatings,
  ratings,
  onSubmitRating,
  canRate = false
}: RatingSystemProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState<Partial<Rating>>({
    rating: 0,
    review: '',
    categories: {
      communication: 0,
      professionalism: 0,
      waitTime: 0,
      facilities: 0,
      overall: 0
    },
    wouldRecommend: false
  });

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onPress?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => interactive && onPress?.(index + 1)}
        disabled={!interactive}
      >
        <Star
          size={size}
          color={index < Math.floor(rating) ? '#FFD700' : '#E5E5EA'}
          fill={index < Math.floor(rating) ? '#FFD700' : 'transparent'}
        />
      </TouchableOpacity>
    ));
  };

  const renderCategoryRating = (category: string, rating: number, onUpdate: (rating: number) => void) => (
    <View style={styles.categoryRating}>
      <Text style={styles.categoryLabel}>{category}</Text>
      <View style={styles.categoryStars}>
        {renderStars(rating, 20, true, onUpdate)}
      </View>
    </View>
  );

  const handleSubmitRating = () => {
    if (newRating.rating && newRating.rating > 0) {
      const ratingData: Partial<Rating> = {
        ...newRating,
        id: `RATING-${Date.now()}`,
        date: new Date().toISOString(),
        verified: true,
        helpful: 0
      };
      
      onSubmitRating?.(ratingData);
      setShowRatingModal(false);
      setNewRating({
        rating: 0,
        review: '',
        categories: {
          communication: 0,
          professionalism: 0,
          waitTime: 0,
          facilities: 0,
          overall: 0
        },
        wouldRecommend: false
      });
    }
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating - 1]++;
      }
    });
    return distribution.reverse(); // 5 stars first
  };

  const distribution = getRatingDistribution();

  return (
    <View style={styles.container}>
      {/* Rating Summary */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.averageRating}>
            <Text style={styles.averageNumber}>{averageRating.toFixed(1)}</Text>
            <View style={styles.averageStars}>
              {renderStars(averageRating, 20)}
            </View>
            <Text style={styles.totalRatings}>
              Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.ratingDistribution}>
            {distribution.map((count, index) => {
              const starCount = 5 - index;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <View key={starCount} style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>{starCount}</Text>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <View style={styles.distributionBar}>
                    <View 
                      style={[
                        styles.distributionFill, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.distributionCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {canRate && (
          <Button
            title="Write a Review"
            onPress={() => setShowRatingModal(true)}
            variant="primary"
            style={styles.writeReviewButton}
            icon={<Star size={16} color="#FFFFFF" />}
          />
        )}
      </Card>

      {/* Individual Reviews */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Patient Reviews</Text>
        
        {ratings.map((rating) => (
          <Card key={rating.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <View style={styles.reviewerAvatar}>
                  <User size={20} color="#666666" />
                </View>
                <View style={styles.reviewerDetails}>
                  <View style={styles.reviewerNameRow}>
                    <Text style={styles.reviewerName}>{rating.patientName}</Text>
                    {rating.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.serviceType}>{rating.serviceType}</Text>
                </View>
              </View>
              <View style={styles.reviewMeta}>
                <View style={styles.reviewStars}>
                  {renderStars(rating.rating, 16)}
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(rating.date).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <Text style={styles.reviewText}>{rating.review}</Text>

            {/* Category Ratings */}
            <View style={styles.categoryRatings}>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>Communication</Text>
                <View style={styles.categoryStarsSmall}>
                  {renderStars(rating.categories.communication, 12)}
                </View>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>Professionalism</Text>
                <View style={styles.categoryStarsSmall}>
                  {renderStars(rating.categories.professionalism, 12)}
                </View>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>Wait Time</Text>
                <View style={styles.categoryStarsSmall}>
                  {renderStars(rating.categories.waitTime, 12)}
                </View>
              </View>
            </View>

            <View style={styles.reviewActions}>
              <TouchableOpacity style={styles.helpfulButton}>
                <ThumbsUp size={16} color="#666666" />
                <Text style={styles.helpfulText}>Helpful ({rating.helpful})</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.reportButton}>
                <Flag size={16} color="#666666" />
                <Text style={styles.reportText}>Report</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate {providerName}</Text>
            <TouchableOpacity onPress={() => setShowRatingModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Overall Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Overall Rating</Text>
              <View style={styles.overallRatingStars}>
                {renderStars(newRating.rating || 0, 32, true, (rating) => 
                  setNewRating(prev => ({ ...prev, rating }))
                )}
              </View>
            </View>

            {/* Category Ratings */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Rate by Category</Text>
              
              {renderCategoryRating('Communication', newRating.categories?.communication || 0, (rating) =>
                setNewRating(prev => ({
                  ...prev,
                  categories: { ...prev.categories!, communication: rating }
                }))
              )}
              
              {renderCategoryRating('Professionalism', newRating.categories?.professionalism || 0, (rating) =>
                setNewRating(prev => ({
                  ...prev,
                  categories: { ...prev.categories!, professionalism: rating }
                }))
              )}
              
              {renderCategoryRating('Wait Time', newRating.categories?.waitTime || 0, (rating) =>
                setNewRating(prev => ({
                  ...prev,
                  categories: { ...prev.categories!, waitTime: rating }
                }))
              )}
              
              {renderCategoryRating('Facilities', newRating.categories?.facilities || 0, (rating) =>
                setNewRating(prev => ({
                  ...prev,
                  categories: { ...prev.categories!, facilities: rating }
                }))
              )}
            </View>

            {/* Written Review */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Write a Review</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience with other patients..."
                value={newRating.review}
                onChangeText={(text) => setNewRating(prev => ({ ...prev, review: text }))}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Recommendation */}
            <View style={styles.ratingSection}>
              <TouchableOpacity 
                style={styles.recommendationButton}
                onPress={() => setNewRating(prev => ({ ...prev, wouldRecommend: !prev.wouldRecommend }))}
              >
                <View style={[
                  styles.checkbox,
                  newRating.wouldRecommend && styles.checkboxSelected
                ]}>
                  {newRating.wouldRecommend && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.recommendationText}>
                  I would recommend this provider to others
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Submit Review"
              onPress={handleSubmitRating}
              variant="primary"
              style={styles.submitButton}
              disabled={!newRating.rating || newRating.rating === 0}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  averageRating: {
    alignItems: 'center',
    flex: 1,
  },
  averageNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  averageStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalRatings: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  ratingDistribution: {
    flex: 1,
    marginLeft: 20,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distributionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    width: 12,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  distributionCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    width: 20,
    textAlign: 'right',
  },
  writeReviewButton: {
    marginTop: 16,
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  serviceType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  reviewText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
    marginBottom: 12,
  },
  categoryRatings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  categoryStarsSmall: {
    flexDirection: 'row',
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  modalClose: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  overallRatingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  categoryRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    flex: 1,
  },
  categoryStars: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  recommendationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});