import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { 
  Pill, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  ShoppingCart,
  Plus,
  Filter,
  Search,
  Building2,
  Star,
  Navigation,
  Phone
} from 'lucide-react-native';

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
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  phone: string;
  services: string[];
  hasStock: boolean;
  estimatedPrice: number;
  deliveryAvailable: boolean;
  deliveryTime?: string;
}

const prescriptions: Prescription[] = [
  {
    id: 'PRES-001',
    medication: 'Paracetamol 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '7 days',
    instructions: 'Take with food. Complete the full course.',
    quantity: 14,
    price: 350,
    prescribedBy: {
      name: 'Dr. Sarah Mwangi',
      specialty: 'General Practitioner'
    },
    prescribedDate: '2024-06-25',
    status: 'pending'
  },
  {
    id: 'PRES-002',
    medication: 'Amoxicillin 250mg',
    dosage: '250mg',
    frequency: 'Three times daily',
    duration: '10 days',
    instructions: 'Take on empty stomach. Do not skip doses.',
    quantity: 30,
    price: 850,
    prescribedBy: {
      name: 'Dr. Sarah Mwangi',
      specialty: 'General Practitioner'
    },
    prescribedDate: '2024-06-25',
    status: 'pending'
  }
];

const nearbyPharmacies: Pharmacy[] = [
  {
    id: 'PHARM-001',
    name: 'Westlands Pharmacy',
    address: 'Westlands Shopping Centre, Nairobi',
    distance: 0.8,
    rating: 4.5,
    isOpen: true,
    phone: '+254 20 4440000',
    services: ['Prescription Filling', 'OTC Medicines', 'Health Screening'],
    hasStock: true,
    estimatedPrice: 1200,
    deliveryAvailable: true,
    deliveryTime: '30-45 min'
  },
  {
    id: 'PHARM-002',
    name: 'Nairobi Central Pharmacy',
    address: 'Kenyatta Avenue, CBD',
    distance: 1.2,
    rating: 4.3,
    isOpen: true,
    phone: '+254 20 2712000',
    services: ['Prescription Filling', 'Medical Supplies', 'Consultation'],
    hasStock: true,
    estimatedPrice: 1150,
    deliveryAvailable: false
  },
  {
    id: 'PHARM-003',
    name: 'Karen Medical Pharmacy',
    address: 'Karen Shopping Centre',
    distance: 2.1,
    rating: 4.7,
    isOpen: true,
    phone: '+254 20 3883000',
    services: ['Prescription Filling', 'Specialized Medicines', 'Home Delivery'],
    hasStock: false,
    estimatedPrice: 1300,
    deliveryAvailable: true,
    deliveryTime: '45-60 min'
  }
];

export default function Prescriptions() {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [showPharmacySelection, setShowPharmacySelection] = useState(false);
  const { addToCart } = useCart();

  const handleSelectPrescription = (prescriptionId: string) => {
    setSelectedPrescriptions(prev => {
      if (prev.includes(prescriptionId)) {
        return prev.filter(id => id !== prescriptionId);
      } else {
        return [...prev, prescriptionId];
      }
    });
  };

  const handleSelectAllPrescriptions = () => {
    if (selectedPrescriptions.length === prescriptions.length) {
      setSelectedPrescriptions([]);
    } else {
      setSelectedPrescriptions(prescriptions.map(p => p.id));
    }
  };

  const handleAddToCart = () => {
    if (selectedPrescriptions.length === 0) {
      Alert.alert('No Prescriptions Selected', 'Please select at least one prescription to add to cart.');
      return;
    }

    if (!selectedPharmacy) {
      setShowPharmacySelection(true);
      return;
    }

    // Add selected prescriptions to cart
    selectedPrescriptions.forEach(prescriptionId => {
      const prescription = prescriptions.find(p => p.id === prescriptionId);
      if (prescription) {
        addToCart({
          id: prescription.id,
          name: prescription.medication,
          price: prescription.price,
          provider: selectedPharmacy.name,
          duration: 0, // Prescriptions don't have duration
          category: 'Prescription Medicine',
          prescriptionId: prescription.id
        });
      }
    });

    Alert.alert(
      'Added to Cart',
      `${selectedPrescriptions.length} prescription(s) added to cart from ${selectedPharmacy.name}`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => {} }
      ]
    );

    setSelectedPrescriptions([]);
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

  const renderPrescription = ({ item }: { item: Prescription }) => {
    const isSelected = selectedPrescriptions.includes(item.id);
    
    return (
      <Card style={[styles.prescriptionCard, isSelected && styles.selectedCard]}>
        <TouchableOpacity onPress={() => handleSelectPrescription(item.id)}>
          <View style={styles.prescriptionHeader}>
            <View style={styles.medicationInfo}>
              <View style={styles.medicationTitleRow}>
                <Pill size={20} color="#2563EB" />
                <Text style={styles.medicationName}>{item.medication}</Text>
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected
                ]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <Text style={styles.prescriptionDetails}>
                {item.dosage} • {item.frequency} • {item.duration}
              </Text>
              <Text style={styles.instructions}>{item.instructions}</Text>
            </View>
            <View style={styles.prescriptionMeta}>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Text style={styles.quantity}>Qty: {item.quantity}</Text>
            </View>
          </View>

          <View style={styles.prescriptionFooter}>
            <View style={styles.prescribedBy}>
              <User size={14} color="#666666" />
              <Text style={styles.doctorName}>{item.prescribedBy.name}</Text>
            </View>
            <View style={styles.prescribedDate}>
              <Calendar size={14} color="#666666" />
              <Text style={styles.dateText}>
                {new Date(item.prescribedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderPharmacy = ({ item }: { item: Pharmacy }) => (
    <Card style={[
      styles.pharmacyCard,
      selectedPharmacy?.id === item.id && styles.selectedPharmacyCard
    ]}>
      <TouchableOpacity onPress={() => setSelectedPharmacy(item)}>
        <View style={styles.pharmacyHeader}>
          <View style={styles.pharmacyInfo}>
            <View style={styles.pharmacyTitleRow}>
              <Building2 size={20} color="#10B981" />
              <Text style={styles.pharmacyName}>{item.name}</Text>
            </View>
            <View style={styles.pharmacyMeta}>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(item.rating)}
                </View>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.distance}>{item.distance} km away</Text>
            </View>
            <View style={styles.addressContainer}>
              <MapPin size={14} color="#666666" />
              <Text style={styles.address}>{item.address}</Text>
            </View>
          </View>
          <View style={styles.pharmacyStatus}>
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
            <Text style={styles.estimatedPrice}>
              Est. {formatCurrency(item.estimatedPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.pharmacyDetails}>
          <View style={styles.stockStatus}>
            <View style={[
              styles.stockIndicator,
              { backgroundColor: item.hasStock ? '#10B981' : '#EF4444' }
            ]} />
            <Text style={styles.stockText}>
              {item.hasStock ? 'In Stock' : 'Limited Stock'}
            </Text>
          </View>

          {item.deliveryAvailable && (
            <View style={styles.deliveryInfo}>
              <Clock size={14} color="#2563EB" />
              <Text style={styles.deliveryText}>
                Delivery: {item.deliveryTime}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.pharmacyActions}>
          <Button
            title="Call"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.pharmacyActionButton}
            icon={<Phone size={16} color="#2563EB" />}
          />
          <Button
            title="Directions"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.pharmacyActionButton}
            icon={<Navigation size={16} color="#2563EB" />}
          />
          <Button
            title="Select"
            onPress={() => {
              setSelectedPharmacy(item);
              setShowPharmacySelection(false);
            }}
            variant="primary"
            size="small"
            style={styles.pharmacyActionButton}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  const totalSelectedPrice = selectedPrescriptions.reduce((total, prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    return total + (prescription?.price || 0);
  }, 0);

  return (
    <View style={styles.container}>
      <Header title="My Prescriptions" subtitle="Manage and fill your prescriptions" />
      
      <View style={styles.content}>
        {!showPharmacySelection ? (
          // Prescriptions List
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary Card */}
            <Card style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{prescriptions.length}</Text>
                  <Text style={styles.summaryLabel}>Total Prescriptions</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{selectedPrescriptions.length}</Text>
                  <Text style={styles.summaryLabel}>Selected</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{formatCurrency(totalSelectedPrice)}</Text>
                  <Text style={styles.summaryLabel}>Total Cost</Text>
                </View>
              </View>
            </Card>

            {/* Selection Controls */}
            <View style={styles.selectionControls}>
              <TouchableOpacity 
                style={styles.selectAllButton}
                onPress={handleSelectAllPrescriptions}
              >
                <Text style={styles.selectAllText}>
                  {selectedPrescriptions.length === prescriptions.length ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>

              {selectedPharmacy && (
                <View style={styles.selectedPharmacyInfo}>
                  <Building2 size={16} color="#10B981" />
                  <Text style={styles.selectedPharmacyText}>{selectedPharmacy.name}</Text>
                  <TouchableOpacity onPress={() => setShowPharmacySelection(true)}>
                    <Text style={styles.changePharmacyText}>Change</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Prescriptions List */}
            <FlatList
              data={prescriptions}
              renderItem={renderPrescription}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.prescriptionsList}
            />

            {/* Add to Cart Button */}
            {selectedPrescriptions.length > 0 && (
              <View style={styles.addToCartContainer}>
                <Button
                  title={selectedPharmacy ? "Add to Cart" : "Select Pharmacy & Add to Cart"}
                  onPress={handleAddToCart}
                  variant="primary"
                  style={styles.addToCartButton}
                  icon={<ShoppingCart size={20} color="#FFFFFF" />}
                />
              </View>
            )}
          </ScrollView>
        ) : (
          // Pharmacy Selection
          <View style={styles.pharmacySelectionContainer}>
            <View style={styles.pharmacySelectionHeader}>
              <Text style={styles.pharmacySelectionTitle}>Select Pharmacy</Text>
              <TouchableOpacity onPress={() => setShowPharmacySelection(false)}>
                <Text style={styles.backButton}>Back</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.selectionSummary}>
              <Text style={styles.selectionSummaryText}>
                {selectedPrescriptions.length} prescription(s) selected • {formatCurrency(totalSelectedPrice)}
              </Text>
            </Card>

            <FlatList
              data={nearbyPharmacies}
              renderItem={renderPharmacy}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.pharmaciesList}
            />
          </View>
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
  summaryCard: {
    marginVertical: 16,
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB15',
    borderRadius: 20,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  selectedPharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedPharmacyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 4,
    marginRight: 8,
  },
  changePharmacyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  prescriptionsList: {
    flex: 1,
  },
  prescriptionCard: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
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
  prescriptionDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
  },
  prescriptionMeta: {
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
  },
  prescriptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prescribedBy: {
    flexDirection: 'row',
    alignItems: 'center',
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
  addToCartContainer: {
    paddingVertical: 16,
  },
  addToCartButton: {
    paddingVertical: 16,
  },
  pharmacySelectionContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  pharmacySelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pharmacySelectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  backButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  selectionSummary: {
    marginBottom: 16,
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  selectionSummaryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    textAlign: 'center',
  },
  pharmaciesList: {
    flex: 1,
  },
  pharmacyCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPharmacyCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  pharmacyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  pharmacyStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  estimatedPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  pharmacyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    marginLeft: 4,
  },
  pharmacyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pharmacyActionButton: {
    flex: 1,
  },
});