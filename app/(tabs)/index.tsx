import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Heart, Activity, Users, Calendar, DollarSign, Package, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, FileText } from 'lucide-react-native';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const periods = ['Today', 'Week', 'Month', 'Year'];

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dashboardStats = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: '#2563EB'
    },
    {
      title: 'Today\'s Revenue',
      value: 'KES 125K',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: '#10B981'
    },
    {
      title: 'Appointments',
      value: '24',
      change: '-3%',
      trend: 'down',
      icon: Calendar,
      color: '#F59E0B'
    },
    {
      title: 'Inventory Value',
      value: 'KES 2.1M',
      change: '+5%',
      trend: 'up',
      icon: Package,
      color: '#8B5CF6'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'appointment',
      title: 'New appointment booked',
      description: 'Grace Wanjiku scheduled for tomorrow 10:30 AM',
      time: '5 minutes ago',
      icon: Calendar,
      color: '#2563EB'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment received',
      description: 'KES 2,500 from James Kiprotich',
      time: '15 minutes ago',
      icon: DollarSign,
      color: '#10B981'
    },
    {
      id: '3',
      type: 'inventory',
      title: 'Low stock alert',
      description: 'Paracetamol 500mg running low (15 units left)',
      time: '1 hour ago',
      icon: Package,
      color: '#F59E0B'
    },
    {
      id: '4',
      type: 'patient',
      title: 'Patient record updated',
      description: 'Mary Njeri\'s vitals recorded',
      time: '2 hours ago',
      icon: Heart,
      color: '#EF4444'
    }
  ];

  const upcomingAppointments = [
    {
      id: '1',
      patient: 'Grace Wanjiku',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      id: '2',
      patient: 'James Kiprotich',
      time: '11:15 AM',
      type: 'Consultation',
      status: 'pending'
    },
    {
      id: '3',
      patient: 'Mary Njeri',
      time: '2:00 PM',
      type: 'Prenatal Check',
      status: 'confirmed'
    }
  ];

  const criticalAlerts = [
    {
      id: '1',
      type: 'critical',
      message: '3 patients require immediate attention',
      action: 'View Patients'
    },
    {
      id: '2',
      type: 'warning',
      message: '5 inventory items below minimum stock',
      action: 'Reorder Stock'
    },
    {
      id: '3',
      type: 'info',
      message: '12 pending insurance claims to process',
      action: 'Process Claims'
    }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="AfyaBora Dashboard" 
        subtitle={`Healthcare Management • ${todayDate}`}
        greeting="Good morning, Dr. Sarah"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dashboard Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <View style={styles.trendContainer}>
                    {stat.trend === 'up' ? (
                      <TrendingUp size={16} color="#10B981" />
                    ) : (
                      <TrendingDown size={16} color="#EF4444" />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: stat.trend === 'up' ? '#10B981' : '#EF4444' }
                    ]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Critical Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Alerts</Text>
          <View style={styles.alertsContainer}>
            {criticalAlerts.map((alert) => (
              <Card key={alert.id} style={[
                styles.alertCard,
                alert.type === 'critical' && styles.criticalAlert,
                alert.type === 'warning' && styles.warningAlert,
                alert.type === 'info' && styles.infoAlert
              ]}>
                <View style={styles.alertContent}>
                  <View style={styles.alertIcon}>
                    {alert.type === 'critical' && <AlertTriangle size={20} color="#EF4444" />}
                    {alert.type === 'warning' && <AlertTriangle size={20} color="#F59E0B" />}
                    {alert.type === 'info' && <CheckCircle size={20} color="#2563EB" />}
                  </View>
                  <View style={styles.alertText}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <TouchableOpacity>
                      <Text style={styles.alertAction}>{alert.action}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <Card>
            {upcomingAppointments.map((appointment, index) => (
              <View key={appointment.id}>
                <View style={styles.appointmentItem}>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.timeText}>{appointment.time}</Text>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#F59E0B' }
                    ]} />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>{appointment.patient}</Text>
                    <Text style={styles.appointmentType}>{appointment.type}</Text>
                  </View>
                  <TouchableOpacity style={styles.appointmentAction}>
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                </View>
                {index < upcomingAppointments.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <Card>
            {recentActivities.map((activity, index) => (
              <View key={activity.id}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                    <activity.icon size={16} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
                {index < recentActivities.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#2563EB15' }]}>
                <Users size={24} color="#2563EB" />
              </View>
              <Text style={styles.quickActionTitle}>Add Patient</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B98115' }]}>
                <Calendar size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionTitle}>Book Appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B15' }]}>
                <Package size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionTitle}>Update Inventory</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF615' }]}>
                <FileText size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionTitle}>Generate Report</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#2563EB',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  activePeriodText: {
    color: '#FFFFFF',
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
  viewAll: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
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
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
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
  },
  alertsContainer: {
    gap: 8,
  },
  alertCard: {
    padding: 12,
  },
  criticalAlert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  warningAlert: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
  },
  infoAlert: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  alertAction: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  appointmentTime: {
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  appointmentAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2563EB15',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: -16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickActionCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
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
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 32,
  },
});