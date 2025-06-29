import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Stethoscope, Users, Shield, ArrowRight, CircleCheck as CheckCircle, Star, Activity } from 'lucide-react-native';

interface UserRole {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  route: string;
}

const userRoles: UserRole[] = [
  {
    id: 'patient',
    title: 'Patient',
    subtitle: 'Access healthcare services',
    description: 'Book appointments, consult with doctors, manage prescriptions, and track your health journey.',
    icon: Heart,
    color: '#EF4444',
    features: [
      'Book appointments with healthcare providers',
      'Remote video consultations',
      'Prescription management',
      'Health records tracking',
      'Find nearby medical facilities'
    ],
    route: '/(tabs)'
  },
  {
    id: 'provider',
    title: 'Healthcare Provider',
    subtitle: 'Manage your practice',
    description: 'Conduct consultations, manage patients, prescribe medications, and grow your practice.',
    icon: Stethoscope,
    color: '#2563EB',
    features: [
      'Patient management system',
      'Remote consultation platform',
      'Digital prescription tools',
      'Appointment scheduling',
      'Practice analytics'
    ],
    route: '/(tabs)'
  },
  {
    id: 'admin',
    title: 'Administrator',
    subtitle: 'System management',
    description: 'Oversee platform operations, manage users, monitor system health, and ensure compliance.',
    icon: Shield,
    color: '#10B981',
    features: [
      'User management and verification',
      'System monitoring and analytics',
      'Compliance and reporting',
      'Platform configuration',
      'Support and maintenance'
    ],
    route: '/(tabs)'
  }
];

export default function AuthLanding() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { isAuthenticated, isLoading, login } = useAuth();

  // Redirect to main app if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logo}>
          <Activity size={32} color="#2563EB" />
        </View>
        <Text style={styles.appName}>AfyaBora</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role.id);
    
    // Create mock user data based on selected role
    const userData = {
      id: `USER-${Date.now()}`,
      name: role.id === 'patient' ? 'John Doe' : 
            role.id === 'provider' ? 'Dr. Sarah Mwangi' : 
            'Admin User',
      email: role.id === 'patient' ? 'john.doe@email.com' : 
             role.id === 'provider' ? 'dr.sarah@nairobimedical.co.ke' : 
             'admin@afyabora.com',
      role: role.id as 'patient' | 'provider' | 'admin',
      avatar: role.id === 'provider' ? 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400' : undefined
    };

    try {
      await login(userData);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      console.error('Login failed:', error);
      setSelectedRole(null);
    }
  };

  const renderRoleCard = (role: UserRole) => {
    const isSelected = selectedRole === role.id;
    const IconComponent = role.icon;

    return (
      <TouchableOpacity
        key={role.id}
        style={[
          styles.roleCard,
          isSelected && styles.selectedRoleCard,
          { borderColor: `${role.color}20` }
        ]}
        onPress={() => handleRoleSelect(role)}
        activeOpacity={0.8}
      >
        <View style={styles.roleCardHeader}>
          <View style={[styles.roleIcon, { backgroundColor: `${role.color}15` }]}>
            <IconComponent size={32} color={role.color} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
          </View>
          <View style={[
            styles.selectIndicator,
            isSelected && { backgroundColor: role.color }
          ]}>
            {isSelected && <CheckCircle size={20} color="#FFFFFF" />}
          </View>
        </View>

        <Text style={styles.roleDescription}>{role.description}</Text>

        <View style={styles.featuresContainer}>
          {role.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <CheckCircle size={14} color={role.color} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.continueButton, { backgroundColor: role.color }]}>
          <Text style={styles.continueButtonText}>Continue as {role.title}</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Activity size={32} color="#2563EB" />
          </View>
          <Text style={styles.appName}>AfyaBora</Text>
          <Text style={styles.tagline}>Healthcare Made Simple</Text>
        </View>

        <Image 
          source={{ uri: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.heroImage}
        />

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Welcome to the Future of Healthcare
          </Text>
          <Text style={styles.heroSubtitle}>
            Connect patients with healthcare providers through our comprehensive digital health platform
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Providers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <View style={styles.ratingContainer}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Role Selection */}
      <View style={styles.roleSelectionSection}>
        <Text style={styles.sectionTitle}>Choose Your Role</Text>
        <Text style={styles.sectionSubtitle}>
          Select how you'd like to use AfyaBora to get started with the right experience for you
        </Text>

        <View style={styles.rolesContainer}>
          {userRoles.map(renderRoleCard)}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose AfyaBora?</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#EF444415' }]}>
              <Heart size={24} color="#EF4444" />
            </View>
            <Text style={styles.featureTitle}>Patient-Centered Care</Text>
            <Text style={styles.featureDescription}>
              Comprehensive health management tools designed around patient needs
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#2563EB15' }]}>
              <Stethoscope size={24} color="#2563EB" />
            </View>
            <Text style={styles.featureTitle}>Professional Tools</Text>
            <Text style={styles.featureDescription}>
              Advanced practice management and consultation platforms for providers
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#10B98115' }]}>
              <Shield size={24} color="#10B981" />
            </View>
            <Text style={styles.featureTitle}>Secure & Compliant</Text>
            <Text style={styles.featureDescription}>
              HIPAA-compliant platform with enterprise-grade security
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#F59E0B15' }]}>
              <Users size={24} color="#F59E0B" />
            </View>
            <Text style={styles.featureTitle}>Connected Ecosystem</Text>
            <Text style={styles.featureDescription}>
              Seamless integration between patients, providers, and administrators
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 16,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleSelectionSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedRoleCard: {
    transform: [{ scale: 0.98 }],
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  selectIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#F8FAFC',
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});