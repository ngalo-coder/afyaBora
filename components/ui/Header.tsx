import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Search, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  subtitle?: string;
  greeting?: string;
  showNotifications?: boolean;
  showSearch?: boolean;
  showLogout?: boolean;
}

export function Header({ 
  title, 
  subtitle, 
  greeting, 
  showNotifications = true, 
  showSearch = true,
  showLogout = false 
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          {greeting && <Text style={styles.greeting}>{greeting}</Text>}
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.actions}>
          {showSearch && (
            <TouchableOpacity style={styles.actionButton}>
              <Search size={24} color="#666666" />
            </TouchableOpacity>
          )}
          {showNotifications && (
            <TouchableOpacity style={styles.actionButton}>
              <Bell size={24} color="#666666" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          )}
          {showLogout && (
            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <LogOut size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
});