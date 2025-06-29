import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  status?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  status, 
  icon: Icon, 
  iconColor = '#2563EB' 
}: StatCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'good': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'danger': return '#EF4444';
      default: return '#666666';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Icon size={20} color={iconColor} />
        </View>
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  value: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});