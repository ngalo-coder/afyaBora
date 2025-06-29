import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Navigation, Clock, Phone, Star, Filter, Search, Hospital, Pill, Stethoscope } from 'lucide-react-native';

interface HealthcareLocation {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'lab';
  address: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  waitTime?: string;
  phone: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

const locations: HealthcareLocation[] = [
  {
    id: '1',
    name: 'Nairobi Hospital',
    type: 'hospital',
    address: 'Argwings Kodhek Rd, Nairobi',
    distance: 1.2,
    rating: 4.5,
    isOpen: true,
    waitTime: '15-30 min',
    phone: '+254 20 2845000',
    services: ['Emergency', 'Surgery', 'Cardiology', 'Pediatrics'],
    coordinates: { lat: -1.2921, lng: 36.8219 }
  },
  {
    id: '2',
    name: 'Westlands Pharmacy',
    type: 'pharmacy',
    address: 'Westlands Shopping Centre',
    distance: 0.8,
    rating: 4.2,
    isOpen: true,
    phone: '+254 20 4440000',
    services: ['Prescription', 'OTC Medicines', 'Health Screening'],
    coordinates: { lat: -1.2634, lng: 36.8047 }
  },
  {
    id: '3',
    name: 'Karen Medical Centre',
    type: 'clinic',
    address: 'Karen Shopping Centre',
    distance: 2.1,
    rating: 4.3,
    isOpen: true,
    waitTime: '45-60 min',
    phone: '+254 20 3883000',
    services: ['General Practice', 'Dental', 'Physiotherapy'],
    coordinates: { lat: -1.3197, lng: 36.7073 }
  },
  {
    id: '4',
    name: 'Lancet Kenya',
    type: 'lab',
    address: 'Kenyatta Avenue',
    distance: 1.5,
    rating: 4.1,
    isOpen: true,
    waitTime: '10-20 min',
    phone: '+254 20 2712000',
    services: ['Blood Tests', 'X-Ray', 'Ultrasound', 'ECG'],
    coordinates: { lat: -1.2841, lng: 36.8155 }
  },
  {
    id: '5',
    name: 'Aga Khan Hospital',
    type: 'hospital',
    address: '3rd Parklands Ave, Nairobi',
    distance: 3.2,
    rating: 4.7,
    isOpen: true,
    waitTime: '20-40 min',
    phone: '+254 20 3740000',
    services: ['Emergency', 'Specialist Care', 'Maternity', 'ICU'],
    coordinates: { lat: -1.2630, lng: 36.8063 }
  }
];

const filters = ['All', 'Hospitals', 'Clinics', 'Pharmacies', 'Labs', 'Open Now'];

export default function Locations() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Hospital size={20} color="#EF4444" />;
      case 'clinic': return <Stethoscope size={20} color="#2563EB" />;
      case 'pharmacy': return <Pill size={20} color="#10B981" />;
      case 'lab': return <Search size={20} color="#F59E0B" />;
      default: return <MapPin size={20} color="#666666" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#EF4444';
      case 'clinic': return '#2563EB';
      case 'pharmacy': return '#10B981';
      case 'lab': return '#F59E0B';
      default: return '#666666';
    }
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

  const renderLocation = ({ item }: { item: HealthcareLocation }) => (
    <Card style={styles.locationCard}>
      <TouchableOpacity>
        <View style={styles.locationHeader}>
          <View style={styles.locationInfo}>
            <View style={styles.nameRow}>
              {getTypeIcon(item.type)}
              <Text style={styles.locationName}>{item.name}</Text>
            </View>
            <Text style={[styles.locationType, { color: getTypeColor(item.type) }]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
          </View>
          <View style={styles.locationMeta}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.distance}>{item.distance} km</Text>
          </View>
        </View>

        <View style={styles.locationBody}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.isOpen ? '#10B98115' : '#EF444415' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.isOpen ? '#10B981' : '#EF4444' }
              ]}>
                {item.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
            {item.waitTime && (
              <View style={styles.waitTimeContainer}>
                <Clock size={14} color="#666666" />
                <Text style={styles.waitTime}>{item.waitTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            <Text style={styles.servicesText}>{item.services.join(', ')}</Text>
          </View>
        </View>

        <View style={styles.locationActions}>
          <Button
            title="Directions"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<Navigation size={16} color="#2563EB" />}
          />
          <Button
            title="Call"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<Phone size={16} color="#2563EB" />}
          />
          <Button
            title="Book"
            onPress={() => {}}
            variant="primary"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Healthcare Locations" subtitle="Find nearby medical facilities" />
      
      <View style={styles.content}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filters}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.activeFilterChip
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText
                ]}>
                  {filter}
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
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Hospitals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Clinics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Pharmacies</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Labs</Text>
            </View>
          </View>
        </Card>

        {/* Locations List */}
        <FlatList
          data={locations}
          renderItem={renderLocation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.locationsList}
          contentContainerStyle={styles.locationsListContent}
        />
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
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  filters: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeFilterChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  activeFilterText: {
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
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  locationsList: {
    flex: 1,
  },
  locationsListContent: {
    paddingBottom: 32,
  },
  locationCard: {
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  locationType: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  locationMeta: {
    alignItems: 'flex-end',
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
  distance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  locationBody: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  waitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  servicesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginRight: 8,
  },
  servicesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    flex: 1,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});