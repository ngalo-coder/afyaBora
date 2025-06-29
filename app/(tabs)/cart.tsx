import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Building2,
  CircleCheck as CheckCircle,
  TriangleAlert as AlertTriangle,
  Calendar,
  User
} from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'mpesa' | 'card' | 'insurance' | 'cash';
  icon: string;
  description: string;
  processingFee?: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    type: 'mpesa',
    icon: '📱',
    description: 'Pay with M-Pesa mobile money',
    processingFee: 0
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: '💳',
    description: 'Visa, Mastercard accepted',
    processingFee: 50
  },
  {
    id: 'insurance',
    name: 'Health Insurance',
    type: 'insurance',
    icon: '🏥',
    description: 'NHIF, AAR, Jubilee, etc.',
    processingFee: 0
  },
  {
    id: 'cash',
    name: 'Cash Payment',
    type: 'cash',
    icon: '💰',
    description: 'Pay at the facility',
    processingFee: 0
  }
];

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = getCartTotal();
  const selectedPayment = paymentMethods.find(method => method.id === selectedPaymentMethod);
  const processingFee = selectedPayment?.processingFee || 0;
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + processingFee + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add services to your cart before checkout.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call to create service request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Service Request Created!',
        `Your request has been submitted successfully. Total: ${formatCurrency(total)}. You will receive confirmation shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              // Navigate to appointments or confirmation screen
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <Card style={styles.cartItemCard}>
      <View style={styles.cartItemHeader}>
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          <Text style={styles.cartItemProvider}>{item.provider}</Text>
          <Text style={styles.cartItemCategory}>{item.category}</Text>
        </View>
        <View style={styles.cartItemPricing}>
          <Text style={styles.cartItemPrice}>{formatCurrency(item.price)}</Text>
          <View style={styles.durationContainer}>
            <Clock size={12} color="#666666" />
            <Text style={styles.durationText}>{item.duration} min</Text>
          </View>
        </View>
      </View>

      <View style={styles.cartItemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} color="#2563EB" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
        
        <Text style={styles.itemTotal}>
          {formatCurrency(item.price * item.quantity)}
        </Text>
      </View>
    </Card>
  );

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodInfo}>
        <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
        <View style={styles.paymentMethodDetails}>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          <Text style={styles.paymentMethodDescription}>{method.description}</Text>
          {method.processingFee > 0 && (
            <Text style={styles.processingFee}>
              Processing fee: {formatCurrency(method.processingFee)}
            </Text>
          )}
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.radioButtonSelected
      ]}>
        {selectedPaymentMethod === method.id && (
          <CheckCircle size={20} color="#2563EB" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Your Cart" subtitle="Review your selected services" />
        <View style={styles.emptyCartContainer}>
          <ShoppingCart size={64} color="#E5E5EA" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtitle}>
            Browse our healthcare services and add them to your cart
          </Text>
          <Button
            title="Browse Services"
            onPress={() => {}}
            variant="primary"
            style={styles.browseButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Your Cart" subtitle={`${cartItems.length} service${cartItems.length > 1 ? 's' : ''} selected`} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Scheduling Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scheduling Preferences</Text>
          <Card style={styles.schedulingCard}>
            <View style={styles.schedulingRow}>
              <Calendar size={20} color="#2563EB" />
              <View style={styles.schedulingInfo}>
                <Text style={styles.schedulingLabel}>Preferred Date</Text>
                <TouchableOpacity style={styles.schedulingInput}>
                  <Text style={styles.schedulingInputText}>
                    {preferredDate || 'Select date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.schedulingRow}>
              <Clock size={20} color="#2563EB" />
              <View style={styles.schedulingInfo}>
                <Text style={styles.schedulingLabel}>Preferred Time</Text>
                <TouchableOpacity style={styles.schedulingInput}>
                  <Text style={styles.schedulingInputText}>
                    {preferredTime || 'Select time'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            
            {processingFee > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee</Text>
                <Text style={styles.summaryValue}>{formatCurrency(processingFee)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (16% VAT)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </Card>
        </View>

        {/* Important Notes */}
        <Card style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.notesTitle}>Important Information</Text>
          </View>
          <Text style={styles.notesText}>
            • Your service request will be sent to healthcare providers
          </Text>
          <Text style={styles.notesText}>
            • You will receive confirmation within 30 minutes
          </Text>
          <Text style={styles.notesText}>
            • Payment is processed only after service confirmation
          </Text>
          <Text style={styles.notesText}>
            • Cancellation is free up to 2 hours before appointment
          </Text>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <View style={styles.checkoutSummary}>
          <Text style={styles.checkoutTotal}>{formatCurrency(total)}</Text>
          <Text style={styles.checkoutItems}>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} service{cartItems.length > 1 ? 's' : ''}
          </Text>
        </View>
        <Button
          title={isProcessing ? "Processing..." : "Request Services"}
          onPress={handleCheckout}
          variant="primary"
          style={styles.checkoutButton}
          disabled={isProcessing}
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
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  cartItemCard: {
    marginBottom: 12,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  cartItemProvider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 2,
  },
  cartItemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  cartItemPricing: {
    alignItems: 'flex-end',
  },
  cartItemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  removeButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  schedulingCard: {
    gap: 16,
  },
  schedulingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schedulingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  schedulingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  schedulingInput: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  schedulingInputText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  paymentMethodsContainer: {
    gap: 8,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentMethod: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  processingFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2563EB',
  },
  summaryCard: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 4,
  },
  checkoutContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkoutSummary: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  checkoutItems: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  checkoutButton: {
    flex: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
  bottomPadding: {
    height: 32,
  },
});