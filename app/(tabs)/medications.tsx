import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Plus, Filter, Bell, Calendar, Leaf } from 'lucide-react-native';

interface Medication {
  id: string;
  name: string;
  type: 'prescription' | 'otc' | 'herbal';
  dosage: string;
  frequency: string;
  nextDose: string;
  remainingDoses: number;
  totalDoses: number;
  instructions: string;
  sideEffects?: string[];
  status: 'active' | 'completed' | 'missed';
}

const medications: Medication[] = [
  {
    id: '1',
    name: 'Paracetamol',
    type: 'otc',
    dosage: '500mg',
    frequency: 'Every 6 hours',
    nextDose: '14:00',
    remainingDoses: 6,
    totalDoses: 12,
    instructions: 'Take with food',
    sideEffects: ['Nausea', 'Dizziness'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Vitamin D3',
    type: 'otc',
    dosage: '1000 IU',
    frequency: 'Once daily',
    nextDose: '08:00',
    remainingDoses: 28,
    totalDoses: 30,
    instructions: 'Take with breakfast',
    status: 'active'
  },
  {
    id: '3',
    name: 'Ginger Tea',
    type: 'herbal',
    dosage: '1 cup',
    frequency: 'Twice daily',
    nextDose: '18:00',
    remainingDoses: 10,
    totalDoses: 14,
    instructions: 'Steep for 5 minutes',
    status: 'active'
  },
  {
    id: '4',
    name: 'Amoxicillin',
    type: 'prescription',
    dosage: '250mg',
    frequency: 'Three times daily',
    nextDose: 'Completed',
    remainingDoses: 0,
    totalDoses: 21,
    instructions: 'Complete full course',
    status: 'completed'
  }
];

const filters = ['All', 'Active', 'Prescription', 'OTC', 'Herbal'];

export default function Medications() {
  const [selectedFilter, setSelectedFilter] = useState('Active');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return '#EF4444';
      case 'otc': return '#2563EB';
      case 'herbal': return '#10B981';
      default: return '#666666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <Pill size={16} color="#EF4444" />;
      case 'otc': return <Pill size={16} color="#2563EB" />;
      case 'herbal': return <Leaf size={16} color="#10B981" />;
      default: return <Pill size={16} color="#666666" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#2563EB';
      case 'missed': return '#EF4444';
      default: return '#666666';
    }
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <Card style={styles.medicationCard}>
      <TouchableOpacity>
        <View style={styles.medicationHeader}>
          <View style={styles.medicationInfo}>
            <View style={styles.nameRow}>
              {getTypeIcon(item.type)}
              <Text style={styles.medicationName}>{item.name}</Text>
            </View>
            <Text style={styles.dosageInfo}>{item.dosage} • {item.frequency}</Text>
            <Text style={[styles.medicationType, { color: getTypeColor(item.type) }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {Math.round((item.remainingDoses / item.totalDoses) * 100)}%
              </Text>
            </View>
            <Text style={styles.remainingText}>
              {item.remainingDoses}/{item.totalDoses} left
            </Text>
          </View>
        </View>

        <View style={styles.medicationBody}>
          <View style={styles.nextDoseContainer}>
            <Clock size={16} color="#666666" />
            <Text style={styles.nextDoseLabel}>Next dose:</Text>
            <Text style={[
              styles.nextDoseTime,
              { color: item.status === 'completed' ? '#10B981' : '#2563EB' }
            ]}>
              {item.nextDose}
            </Text>
          </View>

          <Text style={styles.instructions}>{item.instructions}</Text>

          {item.sideEffects && (
            <View style={styles.sideEffectsContainer}>
              <AlertTriangle size={14} color="#F59E0B" />
              <Text style={styles.sideEffectsLabel}>Side effects:</Text>
              <Text style={styles.sideEffectsText}>{item.sideEffects.join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={styles.medicationActions}>
          <Button
            title="Details"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          {item.status === 'active' && (
            <Button
              title="Take Now"
              onPress={() => {}}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
          {item.status === 'completed' && (
            <View style={styles.completedBadge}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Medications" subtitle="Track your medicine schedule" />
      
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
              <Text style={styles.summaryNumber}>3</Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>5</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>0</Text>
              <Text style={styles.summaryLabel}>Missed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryLabel}>Reminders</Text>
            </View>
          </View>
        </Card>

        {/* Next Dose Alert */}
        <Card style={styles.alertCard}>
          <View style={styles.alertContent}>
            <Bell size={20} color="#2563EB" />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>Next dose in 2 hours</Text>
              <Text style={styles.alertSubtitle}>Paracetamol 500mg at 2:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Medications List */}
        <FlatList
          data={medications}
          renderItem={renderMedication}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.medicationsList}
          contentContainerStyle={styles.medicationsListContent}
        />

        {/* Add Medication FAB */}
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
  alertCard: {
    marginBottom: 16,
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  alertButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  alertButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  medicationsList: {
    flex: 1,
  },
  medicationsListContent: {
    paddingBottom: 100,
  },
  medicationCard: {
    marginBottom: 12,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  dosageInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  medicationType: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  remainingText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  medicationBody: {
    marginBottom: 16,
  },
  nextDoseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextDoseLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 8,
  },
  nextDoseTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  sideEffectsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
  },
  sideEffectsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 4,
    marginRight: 4,
  },
  sideEffectsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    flex: 1,
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  completedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 4,
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