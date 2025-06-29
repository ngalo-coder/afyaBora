import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Clock, User, Calendar, DollarSign, MapPin, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Hourglass } from 'lucide-react-native';

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

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onPress?: () => void;
}

export function ServiceRequestCard({ request, onPress }: ServiceRequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'in-progress': return '#2563EB';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} color="#10B981" />;
      case 'in-progress': return <Hourglass size={16} color="#2563EB" />;
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'cancelled': return <AlertTriangle size={16} color="#EF4444" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      default: return <Clock size={16} color="#666666" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestId}>Request #{request.id}</Text>
            <Text style={styles.requestDate}>
              Requested: {formatDate(request.requestDate)}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(request.status)}15` }
            ]}>
              {getStatusIcon(request.status)}
              <Text style={[
                styles.statusText,
                { color: getStatusColor(request.status) }
              ]}>
                {request.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.servicesLabel}>Services:</Text>
          <Text style={styles.servicesText}>
            {request.services.join(', ')}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <DollarSign size={16} color="#666666" />
            <Text style={styles.detailText}>
              {formatCurrency(request.totalAmount)}
            </Text>
            <View style={[
              styles.paymentBadge,
              { backgroundColor: request.paymentStatus === 'paid' ? '#10B98115' : '#F59E0B15' }
            ]}>
              <Text style={[
                styles.paymentText,
                { color: request.paymentStatus === 'paid' ? '#10B981' : '#F59E0B' }
              ]}>
                {request.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>

          {request.scheduledDate && (
            <View style={styles.detailRow}>
              <Calendar size={16} color="#666666" />
              <Text style={styles.detailText}>
                Scheduled: {formatDate(request.scheduledDate)}
              </Text>
            </View>
          )}

          {request.provider && (
            <View style={styles.detailRow}>
              <User size={16} color="#666666" />
              <Text style={styles.detailText}>{request.provider.name}</Text>
            </View>
          )}

          {request.provider?.location && (
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666666" />
              <Text style={styles.detailText}>{request.provider.location}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Clock size={16} color="#666666" />
            <Text style={styles.detailText}>
              Est. Duration: {request.estimatedDuration} minutes
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestId: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  requestDate: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
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
    lineHeight: 20,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  paymentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
});