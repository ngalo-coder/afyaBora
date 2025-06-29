import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Pill, User, Calendar, Clock, Building2 } from 'lucide-react-native';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  price: number;
  prescribedBy: {
    name: string;
    specialty: string;
  };
  prescribedDate: string;
  status: 'pending' | 'filled' | 'expired';
  pharmacy?: {
    name: string;
    address: string;
  };
}

interface PrescriptionCardProps {
  prescription: Prescription;
  onPress?: () => void;
  showPharmacy?: boolean;
  isSelected?: boolean;
}

export function PrescriptionCard({ 
  prescription, 
  onPress, 
  showPharmacy = false,
  isSelected = false 
}: PrescriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'filled': return '#10B981';
      case 'expired': return '#EF4444';
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

  return (
    <Card style={[
      styles.card,
      isSelected && styles.selectedCard
    ]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <View style={styles.medicationInfo}>
            <View style={styles.titleRow}>
              <Pill size={20} color="#2563EB" />
              <Text style={styles.medicationName}>{prescription.medication}</Text>
            </View>
            <Text style={styles.dosageInfo}>
              {prescription.dosage} • {prescription.frequency} • {prescription.duration}
            </Text>
            <Text style={styles.instructions}>{prescription.instructions}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatCurrency(prescription.price)}</Text>
            <Text style={styles.quantity}>Qty: {prescription.quantity}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(prescription.status)}15` }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(prescription.status) }
              ]}>
                {prescription.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.prescribedBy}>
            <User size={14} color="#666666" />
            <Text style={styles.doctorName}>
              {prescription.prescribedBy.name} • {prescription.prescribedBy.specialty}
            </Text>
          </View>
          <View style={styles.prescribedDate}>
            <Calendar size={14} color="#666666" />
            <Text style={styles.dateText}>
              {new Date(prescription.prescribedDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {showPharmacy && prescription.pharmacy && (
          <View style={styles.pharmacyInfo}>
            <Building2 size={14} color="#10B981" />
            <Text style={styles.pharmacyText}>
              {prescription.pharmacy.name} • {prescription.pharmacy.address}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 16,
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
  instructions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    lineHeight: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prescribedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  prescribedDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  pharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  pharmacyText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginLeft: 4,
  },
});