import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Heart, Activity, Calendar, Award, Clock, DollarSign } from 'lucide-react-native';

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Mock data based on user role
  const getProviderInfo = () => {
    if (user?.role === 'provider') {
      return {
        name: user.name,
        title: 'General Practitioner',
        license: 'MP-12345-KE',
        facility: 'Nairobi Medical Centre',
        phone: '+254 722 123 456',
        email: user.email,
        specializations: ['Family Medicine', 'Preventive Care', 'Women\'s Health'],
        experience: '8 years',
        rating: 4.8,
        consultationFee: 2500
      };
    }
    return null;
  };

  const practiceStats = [
    { title: 'Patients Today', value: '12', icon: Calendar, color: '#2563EB' },
    { title: 'Total Patients', value: '1,247', icon: Heart, color: '#EF4444' },
    { title: 'Avg Rating', value: '4.8', icon: Activity, color: '#10B981' },
    { title: 'Revenue (Month)', value: 'KES 485K', icon: DollarSign, color: '#F59E0B' }
  ];

  const availabilitySettings = [
    { day: 'Monday', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Tuesday', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Wednesday', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Thursday', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Friday', hours: '8:00 AM - 3:00 PM', available: true },
    { day: 'Saturday', hours: 'Emergency Only', available: false },
    { day: 'Sunday', hours: 'Closed', available: false }
  ];

  const menuItems = [
    { title: 'Account Settings', icon: Settings, color: '#2563EB' },
    { title: 'Notifications', icon: Bell, color: '#EF4444' },
    { title: 'Privacy & Security', icon: Shield, color: '#666666' },
    { title: 'Help & Support', icon: HelpCircle, color: '#2563EB' },
  ];

  // Add provider-specific menu items
  if (user?.role === 'provider') {
    menuItems.unshift(
      { title: 'Availability Settings', icon: Clock, color: '#2563EB' },
      { title: 'Service Pricing', icon: DollarSign, color: '#10B981' },
      { title: 'Professional Credentials', icon: Award, color: '#F59E0B' }
    );
  }

  const providerInfo = getProviderInfo();

  return (
    <View style={styles.container}>
      <Header title="Profile" subtitle={`Manage your ${user?.role || 'account'}`} showSearch={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={32} color="#666666" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userRole}>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              {providerInfo && (
                <View style={styles.providerBadge}>
                  <Text style={styles.providerBadgeText}>Verified Provider</Text>
                </View>
              )}
            </View>
          </View>
          
          {providerInfo && (
            <View style={styles.providerDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>License Number:</Text>
                <Text style={styles.detailValue}>{providerInfo.license}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Consultation Fee:</Text>
                <Text style={styles.detailValue}>KES {providerInfo.consultationFee.toLocaleString()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Specializations:</Text>
                <Text style={styles.detailValue}>{providerInfo.specializations.join(', ')}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Provider Stats */}
        {user?.role === 'provider' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Overview</Text>
            <View style={styles.statsGrid}>
              {practiceStats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* Availability Schedule for Providers */}
        {user?.role === 'provider' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Availability Schedule</Text>
              <TouchableOpacity>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Card style={styles.scheduleCard}>
              {availabilitySettings.map((schedule, index) => (
                <View key={index}>
                  <View style={styles.scheduleItem}>
                    <Text style={styles.dayText}>{schedule.day}</Text>
                    <Text style={[
                      styles.hoursText,
                      { color: schedule.available ? '#1C1C1E' : '#999999' }
                    ]}>
                      {schedule.hours}
                    </Text>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: schedule.available ? '#10B981' : '#EF4444' }
                    ]} />
                  </View>
                  {index < availabilitySettings.length - 1 && <View style={styles.scheduleDivider} />}
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Quick Actions for Providers */}
        {user?.role === 'provider' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#2563EB15' }]}>
                  <Clock size={24} color="#2563EB" />
                </View>
                <Text style={styles.quickActionTitle}>Set Unavailable</Text>
                <Text style={styles.quickActionSubtitle}>Block time slots</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#10B98115' }]}>
                  <DollarSign size={24} color="#10B981" />
                </View>
                <Text style={styles.quickActionTitle}>Update Pricing</Text>
                <Text style={styles.quickActionSubtitle}>Modify consultation fees</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
            
            {/* Logout Button */}
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#EF444415' }]}>
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text style={[styles.menuItemText, styles.logoutText]}>Sign Out</Text>
              </View>
              <ChevronRight size={20} color="#666666" />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <Card style={styles.appInfoCard}>
          <Text style={styles.appInfoTitle}>AfyaBora {user?.role === 'provider' ? 'Provider' : user?.role === 'admin' ? 'Admin' : 'Patient'}</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>© 2024 AfyaBora Health. All rights reserved.</Text>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  editButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  profileCard: {
    marginTop: 16,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  providerBadge: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  providerBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  providerDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  scheduleCard: {
    padding: 0,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
    width: 80,
  },
  hoursText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    textAlign: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
  },
  logoutText: {
    color: '#EF4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 68,
  },
  appInfoCard: {
    alignItems: 'center',
    padding: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  appInfoCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 32,
  },
});