import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, TriangleAlert as AlertTriangle, TrendingDown, TrendingUp, Filter, Plus, Search, ChartBar as BarChart, DollarSign } from 'lucide-react-native';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  movement: 'up' | 'down' | 'stable';
}

const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED-001',
    category: 'Pain Relief',
    currentStock: 15,
    minStock: 20,
    maxStock: 100,
    unitPrice: 2.50,
    totalValue: 37.50,
    lastUpdated: '2024-06-20',
    status: 'low-stock',
    movement: 'down'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    sku: 'MED-002',
    category: 'Antibiotics',
    currentStock: 67,
    minStock: 25,
    maxStock: 150,
    unitPrice: 5.75,
    totalValue: 385.25,
    lastUpdated: '2024-06-21',
    status: 'in-stock',
    movement: 'up'
  },
  {
    id: '3',
    name: 'Insulin Pens',
    sku: 'MED-003',
    category: 'Diabetes Care',
    currentStock: 0,
    minStock: 10,
    maxStock: 50,
    unitPrice: 45.00,
    totalValue: 0,
    lastUpdated: '2024-06-18',
    status: 'out-of-stock',
    movement: 'down'
  },
  {
    id: '4',
    name: 'Blood Pressure Monitor',
    sku: 'DEV-004',
    category: 'Medical Devices',
    currentStock: 25,
    minStock: 5,
    maxStock: 20,
    unitPrice: 125.00,
    totalValue: 3125.00,
    lastUpdated: '2024-06-22',
    status: 'overstock',
    movement: 'up'
  }
];

const filters = ['All', 'Low Stock', 'Out of Stock', 'Overstock', 'Medicines'];

export default function Inventory() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return '#10B981';
      case 'low-stock': return '#F59E0B';
      case 'out-of-stock': return '#EF4444';
      case 'overstock': return '#8B5CF6';
      default: return '#666666';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'in-stock': return '#10B98115';
      case 'low-stock': return '#F59E0B15';
      case 'out-of-stock': return '#EF444415';
      case 'overstock': return '#8B5CF615';
      default: return '#66666615';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case 'up': return <TrendingUp size={16} color="#10B981" />;
      case 'down': return <TrendingDown size={16} color="#EF4444" />;
      default: return <BarChart size={16} color="#666666" />;
    }
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusBackgroundColor(item.status) }
            ]}>
              <Text style={[
                styles.statusText, 
                { color: getStatusColor(item.status) }
              ]}>
                {item.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
            {getMovementIcon(item.movement)}
          </View>
        </View>

        <View style={styles.itemBody}>
          <View style={styles.stockInfo}>
            <View style={styles.stockItem}>
              <Text style={styles.stockNumber}>{item.currentStock}</Text>
              <Text style={styles.stockLabel}>Current</Text>
            </View>
            <View style={styles.stockDivider} />
            <View style={styles.stockItem}>
              <Text style={styles.stockNumber}>{item.minStock}</Text>
              <Text style={styles.stockLabel}>Min</Text>
            </View>
            <View style={styles.stockDivider} />
            <View style={styles.stockItem}>
              <Text style={styles.stockNumber}>{item.maxStock}</Text>
              <Text style={styles.stockLabel}>Max</Text>
            </View>
          </View>

          <View style={styles.valueInfo}>
            <View style={styles.priceContainer}>
              <Text style={styles.unitPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.priceLabel}>Per Unit</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalValue}>{formatCurrency(item.totalValue)}</Text>
              <Text style={styles.totalLabel}>Total Value</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Button
            title="Update Stock"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="Reorder"
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
      <Header title="Pharmacy Inventory" subtitle="Real-time stock management" />
      
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

        {/* Inventory Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>1,247</Text>
              <Text style={styles.summaryLabel}>Total Items</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>KES 2.1M</Text>
              <Text style={styles.summaryLabel}>Total Value</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>23</Text>
              <Text style={styles.summaryLabel}>Low Stock</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>5</Text>
              <Text style={styles.summaryLabel}>Out of Stock</Text>
            </View>
          </View>
        </Card>

        {/* Alerts */}
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.alertTitle}>Stock Alerts</Text>
          </View>
          <Text style={styles.alertMessage}>
            3 critical items need immediate attention: Insulin Pens (out of stock), Paracetamol (low stock), and Blood Pressure Monitors (overstock).
          </Text>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertButtonText}>Generate Purchase Order</Text>
          </TouchableOpacity>
        </Card>

        {/* Inventory List */}
        <FlatList
          data={inventoryItems}
          renderItem={renderInventoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.inventoryList}
          contentContainerStyle={styles.inventoryListContent}
        />

        {/* Add Item FAB */}
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
  alertCard: {
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  inventoryList: {
    flex: 1,
  },
  inventoryListContent: {
    paddingBottom: 100,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  itemSku: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
  },
  statusContainer: {
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
  itemBody: {
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockItem: {
    flex: 1,
    alignItems: 'center',
  },
  stockNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  stockLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  stockDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5EA',
  },
  valueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  unitPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  itemActions: {
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