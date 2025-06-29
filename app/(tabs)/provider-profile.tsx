import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingSystem } from '@/components/ui/RatingSystem';
import { useProviderRatings, usePatientRatingEligibility } from '@/hooks/useRatings';
import { User, MapPin, Phone, Calendar, Clock, Award, GraduationCap, Building2, Star, Heart, Users, CircleCheck as CheckCircle, Video, MessageCircle } from 'lucide-react-native';

interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  image: string;
  location: {
    name: string;
    address: string;
  };
  phone: string;
  email: string;
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  consultationFee: number;
  availability: {
    nextAvailable: string;
    workingHours: string;
  };
  services: string[];
  about: string;
}

// Mock provider data
const provider: Provider = {
  id: 'PROV-001',
  name: 'Dr. Sarah Mwangi',
  title: 'MD, MBBS',
  specialty: 'General Practitioner',
  image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
  location: {
    name: 'Nairobi Medical Centre',
    address: 'Argwings Kodhek Road, Nairobi'
  },
  phone: '+254 722 123 456',
  email: 'dr.sarah@nairobimedical.co.ke',
  experience: 8,
  education: [
    'MD - University of Nairobi (2016)',
    'MBBS - Kenyatta University (2014)'
  ],
  certifications: [
    'Board Certified Family Medicine',
    'Advanced Cardiac Life Support (ACLS)',
    'Pediatric Advanced Life Support (PALS)'
  ],
  languages: ['English', 'Swahili', 'Kikuyu'],
  consultationFee: 2500,
  availability: {
    nextAvailable: '2024-06-26T09:00:00',
    workingHours: 'Mon-Fri: 8:00 AM - 5:00 PM'
  },
  services: [
    'General Consultation',
    'Preventive Care',
    'Health Screenings',
    'Chronic Disease Management',
    'Women\'s Health',
    'Pediatric Care'
  ],
  about: 'Dr. Sarah Mwangi is a dedicated family medicine physician with over 8 years of experience providing comprehensive healthcare to patients of all ages. She specializes in preventive care, chronic disease management, and women\'s health. Dr. Mwangi is committed to building long-term relationships with her patients and providing personalized, compassionate care.'
};

// Mock ratings data
const mockRatings = [
  {
    id: 'RATING-001',
    patientName: 'Grace W.',
    patientId: 'PAT-001',
    rating: 5,
    review: 'Dr. Mwangi is an excellent doctor. She took the time to listen to my concerns and provided clear explanations about my condition. The consultation was thorough and professional.',
    date: '2024-06-20T10:30:00',
    verified: true,
    helpful: 12,
    categories: {
      communication: 5,
      professionalism: 5,
      waitTime: 4,
      facilities: 5,
      overall: 5
    },
    serviceType: 'General Consultation',
    wouldRecommend: true
  },
  {
    id: 'RATING-002',
    patientName: 'James K.',
    patientId: 'PAT-002',
    rating: 4,
    review: 'Good experience overall. Dr. Mwangi was knowledgeable and helpful. The only issue was the wait time, but the quality of care made up for it.',
    date: '2024-06-18T14:15:00',
    verified: true,
    helpful: 8,
    categories: {
      communication: 4,
      professionalism: 5,
      waitTime: 3,
      facilities: 4,
      overall: 4
    },
    serviceType: 'Follow-up Consultation',
    wouldRecommend: true
  }
];

export default function ProviderProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ratings' | 'availability'>('overview');
  const currentPatientId = 'PAT-003'; // This would come from auth context
  
  const { ratings, stats, loading, submitRating } = useProviderRatings(provider.id);
  const { canRate } = usePatientRatingEligibility(currentPatientId, provider.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* About */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{provider.about}</Text>
      </Card>

      {/* Services */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.servicesGrid}>
          {provider.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Education & Certifications */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Education & Certifications</Text>
        
        <View style={styles.credentialSection}>
          <View style={styles.credentialHeader}>
            <GraduationCap size={20} color="#2563EB" />
            <Text style={styles.credentialTitle}>Education</Text>
          </View>
          {provider.education.map((edu, index) => (
            <Text key={index} style={styles.credentialItem}>• {edu}</Text>
          ))}
        </View>

        <View style={styles.credentialSection}>
          <View style={styles.credentialHeader}>
            <Award size={20} color="#F59E0B" />
            <Text style={styles.credentialTitle}>Certifications</Text>
          </View>
          {provider.certifications.map((cert, index) => (
            <Text key={index} style={styles.credentialItem}>• {cert}</Text>
          ))}
        </View>
      </Card>

      {/* Languages */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.languagesContainer}>
          {provider.languages.map((language, index) => (
            <View key={index} style={styles.languageChip}>
              <Text style={styles.languageText}>{language}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderRatings = () => (
    <RatingSystem
      providerId={provider.id}
      providerName={provider.name}
      averageRating={stats?.averageRating || 4.6}
      totalRatings={stats?.totalRatings || mockRatings.length}
      ratings={ratings.length > 0 ? ratings : mockRatings}
      onSubmitRating={submitRating}
      canRate={canRate}
    />
  );

  const renderAvailability = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Next Available</Text>
        <View style={styles.nextAvailableContainer}>
          <Calendar size={24} color="#10B981" />
          <View style={styles.nextAvailableInfo}>
            <Text style={styles.nextAvailableDate}>
              {new Date(provider.availability.nextAvailable).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text style={styles.nextAvailableTime}>
              {new Date(provider.availability.nextAvailable).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
        
        <Button
          title="Book Appointment"
          onPress={() => {}}
          variant="primary"
          style={styles.bookButton}
          icon={<Calendar size={16} color="#FFFFFF" />}
        />
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Working Hours</Text>
        <View style={styles.workingHoursContainer}>
          <Clock size={20} color="#666666" />
          <Text style={styles.workingHoursText}>{provider.availability.workingHours}</Text>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Consultation Options</Text>
        <View style={styles.consultationOptions}>
          <TouchableOpacity style={styles.consultationOption}>
            <Video size={24} color="#2563EB" />
            <Text style={styles.consultationOptionTitle}>Video Call</Text>
            <Text style={styles.consultationOptionPrice}>{formatCurrency(provider.consultationFee)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.consultationOption}>
            <MessageCircle size={24} color="#10B981" />
            <Text style={styles.consultationOptionTitle}>Chat Consultation</Text>
            <Text style={styles.consultationOptionPrice}>{formatCurrency(provider.consultationFee * 0.8)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.consultationOption}>
            <Building2 size={24} color="#F59E0B" />
            <Text style={styles.consultationOptionTitle}>In-Person Visit</Text>
            <Text style={styles.consultationOptionPrice}>{formatCurrency(provider.consultationFee)}</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="Provider Profile" subtitle="Healthcare professional details" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Header */}
        <Card style={styles.headerCard}>
          <View style={styles.providerHeader}>
            <Image source={{ uri: provider.image }} style={styles.providerImage} />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerTitle}>{provider.title}</Text>
              <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      color={index < Math.floor(stats?.averageRating || 4.6) ? '#FFD700' : '#E5E5EA'}
                      fill={index < Math.floor(stats?.averageRating || 4.6) ? '#FFD700' : 'transparent'}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {(stats?.averageRating || 4.6).toFixed(1)} ({stats?.totalRatings || mockRatings.length} reviews)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.providerMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#666666" />
              <Text style={styles.metaText}>{provider.location.name}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color="#666666" />
              <Text style={styles.metaText}>{provider.experience} years experience</Text>
            </View>
            <View style={styles.metaItem}>
              <Heart size={16} color="#666666" />
              <Text style={styles.metaText}>{formatCurrency(provider.consultationFee)} consultation</Text>
            </View>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ratings' && styles.activeTab]}
            onPress={() => setActiveTab('ratings')}
          >
            <Text style={[styles.tabText, activeTab === 'ratings' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'availability' && styles.activeTab]}
            onPress={() => setActiveTab('availability')}
          >
            <Text style={[styles.tabText, activeTab === 'availability' && styles.activeTabText]}>
              Book
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'ratings' && renderRatings()}
          {activeTab === 'availability' && renderAvailability()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerCard: {
    marginVertical: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  providerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginBottom: 2,
  },
  providerSpecialty: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  providerMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    marginBottom: 32,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  credentialSection: {
    marginBottom: 16,
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  credentialTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  credentialItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
    marginLeft: 28,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    backgroundColor: '#2563EB15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  nextAvailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextAvailableInfo: {
    marginLeft: 12,
  },
  nextAvailableDate: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  nextAvailableTime: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  bookButton: {
    marginTop: 8,
  },
  workingHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workingHoursText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  consultationOptions: {
    gap: 12,
  },
  consultationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  consultationOptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
  consultationOptionPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
});