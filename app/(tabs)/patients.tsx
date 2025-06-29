import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Phone, Mail, Calendar, Clock, Heart, TriangleAlert as AlertTriangle, Filter, Plus, Search, MessageCircle, FileText, Activity } from 'lucide-react-native';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
  condition: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'follow-up' | 'discharged';
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
  insuranceStatus: 'nhif' | 'private' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'Grace Wanjiku',
    age: 34,
    gender: 'Female',
    phone: '+254 722 123 456',
    email: 'grace.w@email.com',
    lastVisit: '2024-06-20',
    nextAppointment: '2024-06-25',
    condition: 'Hypertension Management',
    priority: 'medium',
    status: 'active',
    vitals: {
      bloodPressure: '140/90',
      heartRate: 78,
      temperature: 36.5
    },
    insuranceStatus: 'nhif',
    paymentStatus: 'paid'
  },
  {
    id: '2',
    name: 'James Kiprotich',
    age: 45,
    gender: 'Male',
    phone: '+254 733 234 567',
    email: 'james.k@email.com',
    lastVisit: '2024-06-18',
    condition: 'Diabetes Type 2',
    priority: 'high',
    status: 'follow-up',
    vitals: {
      bloodPressure: '160/95',
      heartRate: 85,
      temperature: 37.1
    },
    insuranceStatus: 'private',
    paymentStatus: 'pending'
  },
  {
    id: '3',
    name: 'Mary Njeri',
    age: 28,
    gender: 'Female',
    phone: '+254 744 345 678',
    email: 'mary.n@email.com',
    lastVisit: '2024-06-15',
    nextAppointment: '2024-07-01',
    condition: 'Prenatal Care',
    priority: 'medium',
    status: 'active',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.8
    },
    insuranceStatus: 'nhif',
    paymentStatus: 'paid'
  },
  {
    id: '4',
    name: 'Peter Ochieng',
    age: 52,
    gender: 'Male',
    phone: '+254 755 456 789',
    email: 'peter.o@email.com',
    lastVisit: '2024-06-22',
    condition: 'Post-Surgery Recovery',
    priority: 'high',
    status: 'follow-up',
    vitals: {
      bloodPressure: '130/85',
      heartRate: 68,
      temperature: 36.2
    },
    insuranceStatus: 'cash',
    paymentStatus: 'overdue'
  }
];

const filters = ['All', 'Active', 'Follow-up', 'High Priority', 'Payment Due'];

export default function Patients() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'follow-up': return '#F59E0B';
      case 'discharged': return '#666666';
      default: return '#666666';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#666666';
    }
  };

  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case 'nhif': return '🏥';
      case 'private': return '🏛️';
      case 'cash': return '💰';
      default: return '❓';
    }
  };

  const renderPatient = ({ item }: { item: Patient }) => (
    <Card style={styles.patientCard}>
      <TouchableOpacity>
        <View style={styles.patientHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.patientName}>{item.name}</Text>
              <View style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(item.priority) }
              ]} />
            </View>
            <Text style={styles.patientDetails}>
              {item.age} years • {item.gender}
            </Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}15` }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(item.status) }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.vitalsContainer}>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>BP</Text>
            <Text style={styles.vitalValue}>{item.vitals.bloodPressure}</Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>HR</Text>
            <Text style={styles.vitalValue}>{item.vitals.heartRate}</Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>Temp</Text>
            <Text style={styles.vitalValue}>{item.vitals.temperature}°C</Text>
          </View>
        </View>

        <View style={styles.patientMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#666666" />
              <Text style={styles.metaText}>
                Last: {new Date(item.lastVisit).toLocaleDateString()}
              </Text>
            </View>
            {item.nextAppointment && (
              <View style={styles.metaItem}>
                <Clock size={14} color="#2563EB" />
                <Text style={styles.metaText}>
                  Next: {new Date(item.nextAppointment).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.paymentRow}>
            <View style={styles.insuranceInfo}>
              <Text style={styles.insuranceIcon}>
                {getInsuranceIcon(item.insuranceStatus)}
              </Text>
              <Text style={styles.insuranceText}>
                {item.insuranceStatus.toUpperCase()}
              </Text>
            </View>
            <View style={[
              styles.paymentBadge,
              { backgroundColor: `${getPaymentStatusColor(item.paymentStatus)}15` }
            ]}>
              <Text style={[
                styles.paymentText,
                { color: getPaymentStatusColor(item.paymentStatus) }
              ]}>
                {item.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.patientActions}>
          <Button
            title="Message"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<MessageCircle size={16} color="#2563EB" />}
          />
          <Button
            title="Records"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<FileText size={16} color="#2563EB" />}
          />
          <Button
            title="Consult"
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
      <Header title="Patient Management" subtitle="Monitor and care for your patients" />
      
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

        {/* Patient Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>127</Text>
              <Text style={styles.summaryLabel}>Total Patients</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>8</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>3</Text>
              <Text style={styles.summaryLabel}>High Priority</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>5</Text>
              <Text style={styles.summaryLabel}>Follow-ups</Text>
            </View>
          </View>
        </Card>

        {/* AI Insights */}
        <Card style={styles.aiInsightCard}>
          <View style={styles.aiHeader}>
            <Activity size={20} color="#2563EB" />
            <Text style={styles.aiTitle}>AI Clinical Insights</Text>
          </View>
          <Text style={styles.aiMessage}>
            3 patients require immediate attention: James Kiprotich (elevated BP), Peter Ochieng (post-op check), and 1 overdue payment requiring follow-up.
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>View Detailed Analysis</Text>
          </TouchableOpacity>
        </Card>

        {/* Patients List */}
        <FlatList
          data={patients}
          renderItem={renderPatient}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.patientsList}
          contentContainerStyle={styles.patientsListContent}
        />

        {/* Add Patient FAB */}
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
  aiInsightCard: {
    marginBottom: 16,
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 8,
  },
  aiMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  patientsList: {
    flex: 1,
  },
  patientsListContent: {
    paddingBottom: 100,
  },
  patientCard: {
    marginBottom: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    flex: 1,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  patientDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  condition: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  vitalItem: {
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  patientMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insuranceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insuranceIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  insuranceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  patientActions: {
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