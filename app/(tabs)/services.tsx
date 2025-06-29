import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { 
  Heart, 
  Stethoscope, 
  TestTube, 
  Pill, 
  Baby, 
  Eye, 
  Bone, 
  Brain, 
  Filter, 
  Search, 
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react-native';

interface HealthcareService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  provider: {
    name: string;
    rating: number;
    location: string;
    image: string;
  };
  availability: 'available' | 'busy' | 'unavailable';
  tags: string[];
  isPopular?: boolean;
  discount?: number;
}

const healthcareServices: HealthcareService[] = [
  {
    id: '1',
    name: 'General Consultation',
    category: 'Primary Care',
    description: 'Comprehensive health assessment and medical consultation',
    price: 2500,
    duration: 30,
    provider: {
      name: 'Dr. Sarah Mwangi',
      rating: 4.8,
      location: 'Nairobi Medical Centre',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'available',
    tags: ['consultation', 'primary care', 'health check'],
    isPopular: true
  },
  {
    id: '2',
    name: 'Blood Pressure Monitoring',
    category: 'Diagnostics',
    description: '24-hour blood pressure monitoring with detailed analysis',
    price: 1500,
    duration: 15,
    provider: {
      name: 'Nurse Grace Wanjiku',
      rating: 4.6,
      location: 'Westlands Clinic',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'available',
    tags: ['monitoring', 'hypertension', 'cardiovascular']
  },
  {
    id: '3',
    name: 'Complete Blood Count (CBC)',
    category: 'Laboratory',
    description: 'Comprehensive blood analysis including white cells, red cells, and platelets',
    price: 800,
    duration: 10,
    provider: {
      name: 'Lancet Kenya Lab',
      rating: 4.7,
      location: 'Multiple Locations',
      image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'available',
    tags: ['blood test', 'laboratory', 'screening'],
    isPopular: true
  },
  {
    id: '4',
    name: 'Prenatal Consultation',
    category: 'Maternity',
    description: 'Comprehensive prenatal care and monitoring for expecting mothers',
    price: 3500,
    duration: 45,
    provider: {
      name: 'Dr. Mary Njeri',
      rating: 4.9,
      location: 'Karen Medical Centre',
      image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'busy',
    tags: ['pregnancy', 'maternity', 'prenatal'],
    discount: 10
  },
  {
    id: '5',
    name: 'Dental Cleaning',
    category: 'Dental',
    description: 'Professional dental cleaning and oral health assessment',
    price: 2000,
    duration: 60,
    provider: {
      name: 'Dr. James Kiprotich',
      rating: 4.5,
      location: 'Dental Care Clinic',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'available',
    tags: ['dental', 'cleaning', 'oral health']
  },
  {
    id: '6',
    name: 'Eye Examination',
    category: 'Ophthalmology',
    description: 'Comprehensive eye examination and vision testing',
    price: 1800,
    duration: 30,
    provider: {
      name: 'Dr. Peter Ochieng',
      rating: 4.7,
      location: 'Vision Care Centre',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    availability: 'available',
    tags: ['eye care', 'vision', 'ophthalmology']
  }
];

const categories = ['All', 'Primary Care', 'Diagnostics', 'Laboratory', 'Maternity', 'Dental', 'Ophthalmology'];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, getItemQuantity, updateQuantity, cartItems } = useCart();

  const filteredServices = healthcareServices.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'unavailable': return '#EF4444';
      default: return '#666666';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < Math.floor(rating) ? '#FFD700' : '#E5E5EA'}
        fill={index < Math.floor(rating) ? '#FFD700' : 'transparent'}
      />
    ));
  };

  const renderService = ({ item }: { item: HealthcareService }) => {
    const quantity = getItemQuantity(item.id);
    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

    return (
      <Card style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <View style={styles.serviceTitleRow}>
              <Text style={styles.serviceName}>{item.name}</Text>
              {item.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.serviceCategory}>{item.category}</Text>
            <Text style={styles.serviceDescription}>{item.description}</Text>
          </View>
          <View style={styles.priceContainer}>
            {item.discount && (
              <Text style={styles.originalPrice}>{formatCurrency(item.price)}</Text>
            )}
            <Text style={styles.servicePrice}>{formatCurrency(discountedPrice)}</Text>
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% OFF</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.providerInfo}>
          <Image source={{ uri: item.provider.image }} style={styles.providerImage} />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{item.provider.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(item.provider.rating)}
              </View>
              <Text style={styles.ratingText}>{item.provider.rating}</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#666666" />
              <Text style={styles.locationText}>{item.provider.location}</Text>
            </View>
          </View>
          <View style={styles.serviceMetaContainer}>
            <View style={styles.durationContainer}>
              <Clock size={14} color="#666666" />
              <Text style={styles.durationText}>{item.duration} min</Text>
            </View>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: `${getAvailabilityColor(item.availability)}15` }
            ]}>
              <Text style={[
                styles.availabilityText,
                { color: getAvailabilityColor(item.availability) }
              ]}>
                {item.availability.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceActions}>
          {quantity > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, quantity - 1)}
              >
                <Minus size={16} color="#2563EB" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, quantity + 1)}
              >
                <Plus size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="Add to Cart"
              onPress={() => addToCart({
                id: item.id,
                name: item.name,
                price: discountedPrice,
                provider: item.provider.name,
                duration: item.duration,
                category: item.category
              })}
              variant="primary"
              size="small"
              style={styles.addButton}
              icon={<Plus size={16} color="#FFFFFF" />}
            />
          )}
          <Button
            title="Book Now"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.bookButton}
          />
        </View>
      </Card>
    );
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <Header title="Healthcare Services" subtitle="Browse and book medical services" />
      
      <View style={styles.content}>
        {/* Categories Filter */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.activeCategoryChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredServices.length}</Text>
              <Text style={styles.statLabel}>Services Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15+</Text>
              <Text style={styles.statLabel}>Healthcare Providers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.7</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Emergency Care</Text>
            </View>
          </View>
        </Card>

        {/* Services List */}
        <FlatList
          data={filteredServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.servicesList}
          contentContainerStyle={styles.servicesListContent}
        />

        {/* Cart FAB */}
        {cartItemCount > 0 && (
          <TouchableOpacity style={styles.cartFab}>
            <ShoppingCart size={24} color="#FFFFFF" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
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
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  categories: {
    flex: 1,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeCategoryChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginLeft: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  servicesList: {
    flex: 1,
  },
  servicesListContent: {
    paddingBottom: 100,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  serviceCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  discountBadge: {
    backgroundColor: '#EF444415',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  serviceMetaContainer: {
    alignItems: 'flex-end',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginHorizontal: 16,
  },
  addButton: {
    flex: 1,
  },
  bookButton: {
    flex: 1,
  },
  cartFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});