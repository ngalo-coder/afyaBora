import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Calendar,
  Clock, 
  User,
  Phone,
  MapPin,
  Filter,
  Plus,
  ChevronRight
} from 'lucide-react-native';

interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  location: {
    name: string;
    address: string;
  };
  queuePosition?: number;
}

const appointments: Appointment[] = [
  {
    id: '1',
    doctor: { name: 'Dr. Sarah Mwangi', specialty: 'General Practitioner' },
    date: '2024-06-25',
    time: '10:30',
    duration: 30,
    type: 'Regular Checkup',
    status: 'confirmed',
    location: { name: 'Nairobi Hospital', address: 'Argwings Kodhek Rd' },
    queuePosition: 3
  },
  {
    id: '2',
    doctor: { name: 'Dr. James Kiprotich', specialty: 'Cardiologist' },
    date: '2024-06-28',
    time: '14:00',
    duration: 45,
    type: 'Heart Consultation',
    status: 'pending',
    location: { name: 'Aga Khan Hospital', address: '3rd Parklands Ave' }
  },
  {
    id: '3',
    doctor: { name: 'Dr. Grace Wanjiku', specialty: 'Dermatologist' },
    date: '2024-07-02',
    time: '09:15',
    duration: 20,
    type: 'Skin Examination',
    status: 'confirmed',
    location: { name: 'Karen Medical Centre', address: 'Karen Shopping Centre' }
  },
  {
    id: '4',
    doctor: { name: 'Dr. Peter Ochieng', specialty: 'Orthopedic' },
    date: '2024-06-20',
    time: '11:00',
    duration: 30,
    type: 'Follow-up',
    status: 'completed',
    location: { name: 'MP Shah Hospital', address: 'Shivachi Rd' }
  }
];

const filters = ['All', 'Today', 'This Week', 'This Month'];

export default function Appointments() {
  const [selectedFilter, setSelectedFilter] = useState('This Week');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#2563EB';
      default: return '#666666';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B98115';
      case 'pending': return '#F59E0B15';
      case 'cancelled': return '#EF444415';
      case 'completed': return '#2563EB15';
      default: return '#66666615';
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card style={styles.appointmentCard}>
      <TouchableOpacity>
        <View style={styles.appointmentHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.appointmentTime}>{item.time}</Text>
            <Text style={styles.appointmentDuration}>{item.duration} min</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusBackgroundColor(item.status) }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getStatusColor(item.status) }
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentBody}>
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <User size={20} color="#666666" />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{item.doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{item.doctor.specialty}</Text>
              <Text style={styles.appointmentType}>{item.type}</Text>
            </View>
          </View>

          <View style={styles.appointmentMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#666666" />
              <Text style={styles.metaText}>
                {new Date(item.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color="#666666" />
              <Text style={styles.metaText}>{item.location.name}</Text>
            </View>
            {item.queuePosition && (
              <View style={styles.queueInfo}>
                <Text style={styles.queueText}>Queue position: #{item.queuePosition}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.appointmentActions}>
          <Button
            title="Reschedule"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          {item.status === 'pending' && (
            <Button
              title="Confirm"
              onPress={() => {}}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
          {item.status === 'confirmed' && (
            <Button
              title="Join Queue"
              onPress={() => {}}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Appointments" subtitle="Manage your healthcare schedule" />
      
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

        {/* Today's Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>5</Text>
              <Text style={styles.summaryLabel}>This Week</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>1</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>3</Text>
              <Text style={styles.summaryLabel}>Queue Position</Text>
            </View>
          </View>
        </Card>

        {/* Appointments List */}
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.appointmentsList}
          contentContainerStyle={styles.appointmentsListContent}
        />

        {/* Book Appointment FAB */}
        <TouchableOpacity style={styles.fab}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
  summaryCard: {
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentsListContent: {
    paddingBottom: 100,
  },
  appointmentCard: {
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
  },
  appointmentTime: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  appointmentDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  appointmentBody: {
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  appointmentMeta: {
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
  queueInfo: {
    backgroundColor: '#2563EB15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  queueText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
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
});