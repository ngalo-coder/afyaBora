import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button'; // Assuming you have a Button component
import { erpNextService } from '@/services/erpnext'; // Import the service
import { Users, Phone, Mail, Droplet, Calendar as CalendarIcon, Info } from 'lucide-react-native'; // Added Info for patient_details

// Define an interface for patient data (optional but good practice)
interface PatientFormData {
  patient_name: string;
  mobile: string;
  email: string;
  sex: 'Male' | 'Female' | 'Other' | '';
  blood_group: string;
  date_of_birth: string;
  patient_details: string;
}

export default function AddPatientScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<PatientFormData>({
    patient_name: '',
    mobile: '',
    email: '',
    sex: '',
    blood_group: '',
    date_of_birth: '', // Format YYYY-MM-DD
    patient_details: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePatient = async () => {
    // Basic Validation
    if (!formData.patient_name || !formData.mobile || !formData.sex || !formData.date_of_birth) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Name, Mobile, Sex, Date of Birth).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await erpNextService.createPatient({
        // name: formData.patient_name, // 'name' is often auto-generated or set server-side
        patient_name: formData.patient_name,
        mobile: formData.mobile,
        email: formData.email,
        sex: formData.sex,
        blood_group: formData.blood_group,
        date_of_birth: formData.date_of_birth,
        patient_details: formData.patient_details,
      });

      if (response && response.data) { // Check if response and response.data are not null
        Alert.alert('Success', 'Patient created successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        // Optionally clear form or navigate back
        // router.back();
      } else if (response && response.error) {
        Alert.alert('Error', `Failed to create patient: ${response.error}`);
      }
      else {
        Alert.alert('Error', 'Failed to create patient. Unknown error or ERPNext not configured.');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      Alert.alert('Error', 'An unexpected error occurred while creating the patient.');
    } finally {
      setIsLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; // Common blood groups

  return (
    <View style={styles.container}>
      <Header title="Add New Patient" showBackButton onBackPress={() => router.back()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Patient Information</Text>

          {/* Patient Name */}
          <View style={styles.inputGroup}>
            <Users size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name (e.g., John Doe)"
              value={formData.patient_name}
              onChangeText={(text) => handleInputChange('patient_name', text)}
              placeholderTextColor="#999"
            />
          </View>

          {/* Mobile */}
          <View style={styles.inputGroup}>
            <Phone size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number (e.g., 07XXXXXXXX)"
              value={formData.mobile}
              onChangeText={(text) => handleInputChange('mobile', text)}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Mail size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address (Optional)"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          {/* Sex */}
          <View style={styles.inputGroup}>
             <Users size={20} color="#666" style={styles.inputIcon} />
            <View style={styles.radioContainer}>
              {['Male', 'Female', 'Other'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[styles.radioButton, formData.sex === gender && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('sex', gender as PatientFormData['sex'])}
                >
                  <Text style={[styles.radioText, formData.sex === gender && styles.radioTextSelected]}>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <CalendarIcon size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={formData.date_of_birth}
              onChangeText={(text) => handleInputChange('date_of_birth', text)}
              placeholderTextColor="#999"
            />
          </View>

          {/* Blood Group */}
          <View style={styles.inputGroup}>
            <Droplet size={20} color="#666" style={styles.inputIcon} />
            {/* Basic Picker, consider a custom dropdown or modal for better UX */}
            <TextInput
              style={styles.input}
              placeholder="Blood Group (e.g., O+)"
              value={formData.blood_group}
              onChangeText={(text) => handleInputChange('blood_group', text)}
              placeholderTextColor="#999"
            />
            {/* <Picker
              selectedValue={formData.blood_group}
              style={{ height: 50, width: '100%' }}
              onValueChange={(itemValue) => handleInputChange('blood_group', itemValue)}
            >
              <Picker.Item label="Select Blood Group" value="" />
              {bloodGroups.map(group => <Picker.Item key={group} label={group} value={group} />)}
            </Picker> */}
          </View>

          {/* Patient Details */}
          <View style={styles.inputGroup}>
            <Info size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional Patient Details (Optional)"
              value={formData.patient_details}
              onChangeText={(text) => handleInputChange('patient_details', text)}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          <Button
            title="Save Patient"
            onPress={handleSavePatient}
            isLoading={isLoading}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </Card>
        <View style={{ height: 40 }} />
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
  formCard: {
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  radioContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical:10,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  radioButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  radioText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  radioTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#10B981', // A green color for save
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
