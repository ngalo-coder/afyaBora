import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { ServiceRequestCard } from '@/components/ui/ServiceRequestCard';
import { Filter, Search, Calendar, DollarSign, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

interface ServiceRequest {
  id: string;
  services: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  requestDate: string;
  scheduledDate?: string;
  provider?: {
    name: string;
    location: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  estimatedDuration: number;
}

const serviceRequests: ServiceRequest[] = [
  {
    id: 'REQ-001',
    services: ['General Consultation', 'Blood Pressure Check'],
    totalAmount: 2900,
    status: 'confirmed',
    requestDate: '2024-06-20',
    scheduledDate: '2024-06-25',
    provider: {
      name: 'Dr. Sarah Mwangi',
      location: 'Nairobi Medical Centre'
    },
    paymentStatus: 'paid',
    estimatedDuration: 45
  },
  {
    id: 'REQ-002',
    services: ['Complete Blood Count', 'Liver Function Test'],
    totalAmount: 1500,
    status: 'in-progress',
    requestDate: '2024-06-21',
    scheduledDate: '2024-06-22',
    provider: {
      name: 'Lancet Kenya Lab',
      location: 'Westlands Branch'
    },
    paymentStatus: 'paid',
    estimatedDuration: 20
  },
  {
    id: 'REQ-003',
    services: ['Prenatal Consultation'],
    totalAmount: 4060,
    status: 'pending',
    requestDate: '2024-06-22',
    paymentStatus: 'pending',
    estimatedDuration: 45
  },
  {
    id: 'REQ-004',
    services: ['Dental Cleaning', 'Oral Examination'],
    totalAmount: 2500,
    status: 'completed',
    requestDate: '2024-06-15',
    scheduledDate: '2024-06-18',
    provider: {
      name: 'Dr. James Kiprotich',
      location: 'Dental Care Clinic'
    },
    paymentStatus: 'paid',
    estimatedDuration: 60
  }
];

const filters = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed'];

export default function Requests() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredRequests = serviceRequests.filter(request => {
    if (selectedFilter === 'All') return true;
    return request.status === selectedFilter.toLowerCase().replace(' ', '-');
  });

  const getRequestStats = () => {
    const total = serviceRequests.length;
    const pending = serviceRequests.filter(r => r.status === 'pending').length;
    const confirmed = serviceRequests.filter(r => r.status === 'confirmed').length;
    const completed = serviceRequests.filter(r => r.status === 'completed').length;
    const totalAmount = serviceRequests
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return { total, pending, confirmed, completed, totalAmount };
  };

  const stats = getRequestStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderRequest = ({ item }: { item: ServiceRequest }) => (
    <ServiceRequestCard
      request={item}
      onPress={() => {
        // Navigate to request details
        console.log('View request details:', item.id);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Service Requests" subtitle="Track your healthcare requests" />
      
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

        {/* Stats Summary */}
        <Card style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.confirmed}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCurrency(stats.totalAmount)}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Calendar size={24} color="#2563EB" />
            <Text style={styles.quickActionText}>Schedule Follow-up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.quickActionText}>Payment History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.quickActionText}>Reschedule</Text>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <FlatList
          data={filteredRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.requestsList}
          contentContainerStyle={styles.requestsListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No requests found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'All' 
                  ? 'You haven\'t made any service requests yet'
                  : `No ${selectedFilter.toLowerCase()} requests found`
                }
              </Text>
            </View>
          }
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
    fontSize: 18,
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
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  requestsList: {
    flex: 1,
  },
  requestsListContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
});