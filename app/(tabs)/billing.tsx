import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DollarSign, FileText, User, Calendar, CreditCard, Filter, Plus, Download, Send, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, Building2 } from 'lucide-react-native';

interface Invoice {
  id: string;
  invoiceNumber: string;
  patient: {
    name: string;
    id: string;
  };
  amount: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: 'cash' | 'mpesa' | 'card' | 'insurance';
  services: string[];
  insuranceProvider?: string;
  claimNumber?: string;
}

const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patient: { name: 'Grace Wanjiku', id: 'PAT-001' },
    amount: 2500,
    tax: 400,
    total: 2900,
    date: '2024-06-20',
    dueDate: '2024-06-27',
    status: 'paid',
    paymentMethod: 'mpesa',
    services: ['General Consultation', 'Blood Pressure Check']
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    patient: { name: 'James Kiprotich', id: 'PAT-002' },
    amount: 5000,
    tax: 800,
    total: 5800,
    date: '2024-06-21',
    dueDate: '2024-06-28',
    status: 'pending',
    paymentMethod: 'insurance',
    services: ['Specialist Consultation', 'ECG', 'Lab Tests'],
    insuranceProvider: 'AAR Insurance',
    claimNumber: 'CLM-2024-456'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    patient: { name: 'Mary Njeri', id: 'PAT-003' },
    amount: 3500,
    tax: 560,
    total: 4060,
    date: '2024-06-18',
    dueDate: '2024-06-25',
    status: 'overdue',
    paymentMethod: 'cash',
    services: ['Prenatal Consultation', 'Ultrasound']
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    patient: { name: 'Peter Ochieng', id: 'PAT-004' },
    amount: 7500,
    tax: 1200,
    total: 8700,
    date: '2024-06-22',
    dueDate: '2024-06-29',
    status: 'paid',
    paymentMethod: 'card',
    services: ['Surgery Follow-up', 'Wound Care', 'Medications']
  }
];

const filters = ['All', 'Paid', 'Pending', 'Overdue', 'Insurance Claims'];

export default function Billing() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      case 'cancelled': return '#666666';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} color="#10B981" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'overdue': return <AlertTriangle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#666666" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return '📱';
      case 'card': return '💳';
      case 'cash': return '💰';
      case 'insurance': return '🏥';
      default: return '💳';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <Card style={styles.invoiceCard}>
      <TouchableOpacity>
        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
            <Text style={styles.patientName}>{item.patient.name}</Text>
            <Text style={styles.invoiceDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              {getStatusIcon(item.status)}
              <Text style={[
                styles.statusText,
                { color: getStatusColor(item.status) }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
          </View>
        </View>

        <View style={styles.invoiceBody}>
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            <Text style={styles.servicesText}>{item.services.join(', ')}</Text>
          </View>

          <View style={styles.paymentInfo}>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentIcon}>
                {getPaymentMethodIcon(item.paymentMethod)}
              </Text>
              <Text style={styles.paymentText}>
                {item.paymentMethod.toUpperCase()}
              </Text>
            </View>
            {item.insuranceProvider && (
              <View style={styles.insuranceInfo}>
                <Building2 size={14} color="#666666" />
                <Text style={styles.insuranceText}>{item.insuranceProvider}</Text>
              </View>
            )}
          </View>

          <View style={styles.amountBreakdown}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Subtotal:</Text>
              <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Tax (16%):</Text>
              <Text style={styles.amountValue}>{formatCurrency(item.tax)}</Text>
            </View>
            <View style={[styles.amountRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.invoiceActions}>
          <Button
            title="Download"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<Download size={16} color="#2563EB" />}
          />
          {item.status === 'pending' && (
            <Button
              title="Send Reminder"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.actionButton}
              icon={<Send size={16} color="#2563EB" />}
            />
          )}
          <Button
            title="View Details"
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
      <Header title="Billing & Invoices" subtitle="Financial management" />
      
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

        {/* Financial Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>KES 485K</Text>
              <Text style={styles.summaryLabel}>Monthly Revenue</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>KES 125K</Text>
              <Text style={styles.summaryLabel}>Outstanding</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>24</Text>
              <Text style={styles.summaryLabel}>Pending Invoices</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>8</Text>
              <Text style={styles.summaryLabel}>Insurance Claims</Text>
            </View>
          </View>
        </Card>

        {/* Payment Methods Summary */}
        <Card style={styles.paymentSummaryCard}>
          <Text style={styles.cardTitle}>Payment Methods (This Month)</Text>
          <View style={styles.paymentMethodsGrid}>
            <View style={styles.paymentMethodItem}>
              <Text style={styles.paymentMethodIcon}>📱</Text>
              <Text style={styles.paymentMethodLabel}>M-Pesa</Text>
              <Text style={styles.paymentMethodAmount}>KES 185K</Text>
            </View>
            <View style={styles.paymentMethodItem}>
              <Text style={styles.paymentMethodIcon}>🏥</Text>
              <Text style={styles.paymentMethodLabel}>Insurance</Text>
              <Text style={styles.paymentMethodAmount}>KES 220K</Text>
            </View>
            <View style={styles.paymentMethodItem}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <Text style={styles.paymentMethodLabel}>Card</Text>
              <Text style={styles.paymentMethodAmount}>KES 65K</Text>
            </View>
            <View style={styles.paymentMethodItem}>
              <Text style={styles.paymentMethodIcon}>💰</Text>
              <Text style={styles.paymentMethodLabel}>Cash</Text>
              <Text style={styles.paymentMethodAmount}>KES 15K</Text>
            </View>
          </View>
        </Card>

        {/* Invoices List */}
        <FlatList
          data={invoices}
          renderItem={renderInvoice}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.invoicesList}
          contentContainerStyle={styles.invoicesListContent}
        />

        {/* Create Invoice FAB */}
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
    fontSize: 20,
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
  paymentSummaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paymentMethodItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 4,
  },
  paymentMethodAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  invoicesList: {
    flex: 1,
  },
  invoicesListContent: {
    paddingBottom: 100,
  },
  invoiceCard: {
    marginBottom: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  invoiceBody: {
    marginBottom: 16,
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  servicesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  insuranceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insuranceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  amountBreakdown: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    marginTop: 4,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  amountValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  invoiceActions: {
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