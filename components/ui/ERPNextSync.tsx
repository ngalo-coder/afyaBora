import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from './Card';
import { RefreshCw, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Wifi, WifiOff } from 'lucide-react-native';

interface ERPNextSyncProps {
  onSync?: () => void;
  lastSyncTime?: Date;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  isOnline?: boolean;
}

export function ERPNextSync({ 
  onSync, 
  lastSyncTime, 
  syncStatus = 'idle',
  isOnline = true 
}: ERPNextSyncProps) {
  const [isManualSync, setIsManualSync] = useState(false);

  const handleSync = async () => {
    if (!isOnline || syncStatus === 'syncing') return;
    
    setIsManualSync(true);
    try {
      await onSync?.();
    } finally {
      setIsManualSync(false);
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'syncing': return '#F59E0B';
      default: return '#666666';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'success': return <CheckCircle size={16} color="#10B981" />;
      case 'error': return <AlertTriangle size={16} color="#EF4444" />;
      case 'syncing': return <ActivityIndicator size={16} color="#F59E0B" />;
      default: return <RefreshCw size={16} color="#666666" />;
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never synced';
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card style={styles.syncCard}>
      <View style={styles.syncHeader}>
        <View style={styles.syncInfo}>
          <View style={styles.syncTitleRow}>
            <Text style={styles.syncTitle}>ERPNext Sync</Text>
            <View style={styles.connectionStatus}>
              {isOnline ? (
                <Wifi size={14} color="#10B981" />
              ) : (
                <WifiOff size={14} color="#EF4444" />
              )}
            </View>
          </View>
          <Text style={[styles.syncStatus, { color: getSyncStatusColor() }]}>
            {syncStatus === 'syncing' ? 'Syncing...' : 
             syncStatus === 'success' ? 'Up to date' :
             syncStatus === 'error' ? 'Sync failed' : 'Ready to sync'}
          </Text>
          <Text style={styles.lastSync}>Last sync: {formatLastSync()}</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.syncButton,
            (!isOnline || syncStatus === 'syncing') && styles.syncButtonDisabled
          ]}
          onPress={handleSync}
          disabled={!isOnline || syncStatus === 'syncing'}
        >
          {syncStatus === 'syncing' || isManualSync ? (
            <ActivityIndicator size={20} color="#FFFFFF" />
          ) : (
            <RefreshCw size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.syncDetails}>
        <View style={styles.syncStatusRow}>
          {getSyncStatusIcon()}
          <Text style={styles.syncStatusText}>
            {isOnline ? 'Connected to ERPNext' : 'Offline - Changes will sync when online'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  syncCard: {
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  syncInfo: {
    flex: 1,
  },
  syncTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  syncTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginRight: 8,
  },
  connectionStatus: {
    marginLeft: 'auto',
  },
  syncStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  lastSync: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  syncButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  syncDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 8,
  },
});