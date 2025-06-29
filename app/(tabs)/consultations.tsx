import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  User, 
  Clock, 
  Calendar,
  Pill,
  Plus,
  Send,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  Thermometer,
  Eye,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff
} from 'lucide-react-native';

interface Consultation {
  id: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    avatar: string;
  };
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledTime: string;
  duration: number;
  symptoms: string[];
  vitals?: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  notes: string;
  prescriptions: Prescription[];
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  price: number;
}

const activeConsultations: Consultation[] = [
  {
    id: 'CONS-001',
    patient: {
      name: 'Grace Wanjiku',
      age: 34,
      gender: 'Female',
      avatar: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    type: 'video',
    status: 'in-progress',
    scheduledTime: '2024-06-25T10:30:00',
    duration: 30,
    symptoms: ['Headache', 'Fever', 'Fatigue'],
    vitals: {
      temperature: 38.2,
      bloodPressure: '140/90',
      heartRate: 85,
      oxygenSaturation: 98
    },
    notes: 'Patient reports persistent headache for 2 days with mild fever. No recent travel history.',
    prescriptions: []
  }
];

export default function Consultations() {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({});
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const handleAddPrescription = () => {
    if (selectedConsultation && newPrescription.medication) {
      const prescription: Prescription = {
        id: `PRES-${Date.now()}`,
        medication: newPrescription.medication || '',
        dosage: newPrescription.dosage || '',
        frequency: newPrescription.frequency || '',
        duration: newPrescription.duration || '',
        instructions: newPrescription.instructions || '',
        quantity: newPrescription.quantity || 1,
        price: newPrescription.price || 0
      };

      // Update consultation with new prescription
      selectedConsultation.prescriptions.push(prescription);
      setNewPrescription({});
      setShowPrescriptionModal(false);
    }
  };

  const handleSendPrescriptionToPatient = () => {
    if (selectedConsultation && selectedConsultation.prescriptions.length > 0) {
      // This would send prescriptions to patient's cart
      console.log('Sending prescriptions to patient cart:', selectedConsultation.prescriptions);
      // Show success message
      alert('Prescriptions sent to patient successfully!');
    }
  };

  const renderConsultationCard = ({ item }: { item: Consultation }) => (
    <Card style={styles.consultationCard}>
      <TouchableOpacity onPress={() => setSelectedConsultation(item)}>
        <View style={styles.consultationHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.patientAvatar}>
              <User size={24} color="#666666" />
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{item.patient.name}</Text>
              <Text style={styles.patientMeta}>
                {item.patient.age} years • {item.patient.gender}
              </Text>
              <Text style={styles.symptoms}>
                Symptoms: {item.symptoms.join(', ')}
              </Text>
            </View>
          </View>
          <View style={styles.consultationMeta}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'in-progress' ? '#10B98115' : '#F59E0B15' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'in-progress' ? '#10B981' : '#F59E0B' }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.scheduledTime}>
              {new Date(item.scheduledTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>

        {item.vitals && (
          <View style={styles.vitalsContainer}>
            <View style={styles.vitalItem}>
              <Thermometer size={16} color="#EF4444" />
              <Text style={styles.vitalValue}>{item.vitals.temperature}°C</Text>
            </View>
            <View style={styles.vitalItem}>
              <Heart size={16} color="#EF4444" />
              <Text style={styles.vitalValue}>{item.vitals.bloodPressure}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Activity size={16} color="#10B981" />
              <Text style={styles.vitalValue}>{item.vitals.heartRate} bpm</Text>
            </View>
            <View style={styles.vitalItem}>
              <Eye size={16} color="#2563EB" />
              <Text style={styles.vitalValue}>{item.vitals.oxygenSaturation}%</Text>
            </View>
          </View>
        )}

        <View style={styles.consultationActions}>
          <Button
            title="Join Call"
            onPress={() => {}}
            variant="primary"
            size="small"
            style={styles.actionButton}
            icon={item.type === 'video' ? <Video size={16} color="#FFFFFF" /> : <Phone size={16} color="#FFFFFF" />}
          />
          <Button
            title="Prescribe"
            onPress={() => setShowPrescriptionModal(true)}
            variant="outline"
            size="small"
            style={styles.actionButton}
            icon={<Pill size={16} color="#2563EB" />}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Remote Consultations" subtitle="Manage patient consultations" />
      
      <View style={styles.content}>
        {selectedConsultation ? (
          // Active Consultation View
          <View style={styles.activeConsultationContainer}>
            {/* Video Call Interface */}
            <Card style={styles.videoCallCard}>
              <View style={styles.videoContainer}>
                <View style={styles.patientVideo}>
                  <Text style={styles.videoPlaceholder}>Patient Video</Text>
                  <Text style={styles.patientVideoName}>{selectedConsultation.patient.name}</Text>
                </View>
                <View style={styles.doctorVideo}>
                  <Text style={styles.videoPlaceholder}>Your Video</Text>
                </View>
              </View>
              
              <View style={styles.callControls}>
                <TouchableOpacity 
                  style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
                  onPress={() => setIsAudioEnabled(!isAudioEnabled)}
                >
                  {isAudioEnabled ? <Mic size={20} color="#FFFFFF" /> : <MicOff size={20} color="#FFFFFF" />}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
                  onPress={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video size={20} color="#FFFFFF" /> : <VideoOff size={20} color="#FFFFFF" />}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, styles.endCallButton]}
                  onPress={() => setSelectedConsultation(null)}
                >
                  <PhoneOff size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Patient Information Panel */}
            <Card style={styles.patientInfoCard}>
              <Text style={styles.sectionTitle}>Patient Information</Text>
              <View style={styles.patientInfoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{selectedConsultation.patient.name}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age:</Text>
                  <Text style={styles.infoValue}>{selectedConsultation.patient.age} years</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender:</Text>
                  <Text style={styles.infoValue}>{selectedConsultation.patient.gender}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Symptoms:</Text>
                  <Text style={styles.infoValue}>{selectedConsultation.symptoms.join(', ')}</Text>
                </View>
              </View>
            </Card>

            {/* Prescriptions Panel */}
            <Card style={styles.prescriptionsCard}>
              <View style={styles.prescriptionsHeader}>
                <Text style={styles.sectionTitle}>Prescriptions</Text>
                <Button
                  title="Add Prescription"
                  onPress={() => setShowPrescriptionModal(true)}
                  variant="primary"
                  size="small"
                  icon={<Plus size={16} color="#FFFFFF" />}
                />
              </View>
              
              {selectedConsultation.prescriptions.length > 0 ? (
                <View style={styles.prescriptionsList}>
                  {selectedConsultation.prescriptions.map((prescription) => (
                    <View key={prescription.id} style={styles.prescriptionItem}>
                      <View style={styles.prescriptionInfo}>
                        <Text style={styles.medicationName}>{prescription.medication}</Text>
                        <Text style={styles.prescriptionDetails}>
                          {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                        </Text>
                        <Text style={styles.prescriptionInstructions}>
                          {prescription.instructions}
                        </Text>
                      </View>
                      <Text style={styles.prescriptionPrice}>
                        KES {prescription.price.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  
                  <Button
                    title="Send to Patient Cart"
                    onPress={handleSendPrescriptionToPatient}
                    variant="primary"
                    style={styles.sendPrescriptionButton}
                    icon={<Send size={16} color="#FFFFFF" />}
                  />
                </View>
              ) : (
                <Text style={styles.noPrescriptions}>No prescriptions added yet</Text>
              )}
            </Card>

            {/* Consultation Notes */}
            <Card style={styles.notesCard}>
              <Text style={styles.sectionTitle}>Consultation Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add consultation notes..."
                value={consultationNotes}
                onChangeText={setConsultationNotes}
                multiline
                numberOfLines={4}
              />
              <Button
                title="Save Notes"
                onPress={() => {}}
                variant="outline"
                size="small"
                style={styles.saveNotesButton}
                icon={<FileText size={16} color="#2563EB" />}
              />
            </Card>
          </View>
        ) : (
          // Consultations List View
          <ScrollView style={styles.consultationsList} showsVerticalScrollIndicator={false}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>3</Text>
                  <Text style={styles.summaryLabel}>Active</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>12</Text>
                  <Text style={styles.summaryLabel}>Today</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>45</Text>
                  <Text style={styles.summaryLabel}>This Week</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>2</Text>
                  <Text style={styles.summaryLabel}>Waiting</Text>
                </View>
              </View>
            </Card>

            <FlatList
              data={activeConsultations}
              renderItem={renderConsultationCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </ScrollView>
        )}
      </View>

      {/* Add Prescription Modal */}
      <Modal
        visible={showPrescriptionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Prescription</Text>
            <TouchableOpacity onPress={() => setShowPrescriptionModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medication Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter medication name"
                value={newPrescription.medication}
                onChangeText={(text) => setNewPrescription({...newPrescription, medication: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 500mg"
                value={newPrescription.dosage}
                onChangeText={(text) => setNewPrescription({...newPrescription, dosage: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Twice daily"
                value={newPrescription.frequency}
                onChangeText={(text) => setNewPrescription({...newPrescription, frequency: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 7 days"
                value={newPrescription.duration}
                onChangeText={(text) => setNewPrescription({...newPrescription, duration: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Special instructions for the patient"
                value={newPrescription.instructions}
                onChangeText={(text) => setNewPrescription({...newPrescription, instructions: text})}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1"
                  value={newPrescription.quantity?.toString()}
                  onChangeText={(text) => setNewPrescription({...newPrescription, quantity: parseInt(text) || 1})}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Price (KES)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0"
                  value={newPrescription.price?.toString()}
                  onChangeText={(text) => setNewPrescription({...newPrescription, price: parseFloat(text) || 0})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Button
              title="Add Prescription"
              onPress={handleAddPrescription}
              variant="primary"
              style={styles.addPrescriptionButton}
            />
          </ScrollView>
        </View>
      </Modal>
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
  consultationsList: {
    flex: 1,
  },
  summaryCard: {
    marginVertical: 16,
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
    fontSize: 24,
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
  consultationCard: {
    marginBottom: 16,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  symptoms: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
  },
  consultationMeta: {
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
  scheduledTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  vitalItem: {
    alignItems: 'center',
  },
  vitalValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginTop: 4,
  },
  consultationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  activeConsultationContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  videoCallCard: {
    marginBottom: 16,
    padding: 0,
  },
  videoContainer: {
    height: 200,
    backgroundColor: '#000000',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  patientVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  patientVideoName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  doctorVideo: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 80,
    height: 60,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#EF4444',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
  },
  patientInfoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  patientInfoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    flex: 1,
  },
  prescriptionsCard: {
    marginBottom: 16,
  },
  prescriptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prescriptionsList: {
    gap: 12,
  },
  prescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  prescriptionInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  prescriptionDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  prescriptionInstructions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
  },
  prescriptionPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  sendPrescriptionButton: {
    marginTop: 8,
  },
  noPrescriptions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  notesCard: {
    marginBottom: 16,
  },
  notesInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveNotesButton: {
    alignSelf: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  modalClose: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  addPrescriptionButton: {
    marginTop: 24,
  },
});