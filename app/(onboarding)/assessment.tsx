import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/auth';
import { coachingServices } from '../../constants/coachingServices';

const { userData, user } = useAuth();

export default function AssessmentScreen() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState('');
  const [description, setDescription] = useState('');

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    console.log({
      introduction,
      description,
      selectedServices,
    });

    if (userData) {
      try {
        if (!user?.uid) return;

        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', user.uid);

        await setDoc(userDocRef, {
          services: selectedServices,
          introduction,
          description
        }, { merge: true });

        router.replace('/');
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
    // Navigate to next screen
    router.push('/(screens)');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#ffffff" size={24} />
          </Pressable>
          <Text style={styles.title}>Personal journey</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.congratsCard}>
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsText}>
            You've taken the first step towards transforming your life. Let's get to know you better
            to create your personalized coaching journey.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Tell Us About Yourself</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Introduce Yourself</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name and what brings you here..."
              value={introduction}
              onChangeText={setIntroduction}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Describe Yourself</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your goals, challenges, and what you hope to achieve..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={Platform.OS === 'ios' ? undefined : 4}
              textAlignVertical="top"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Select Coaching Services</Text>
          <Text style={styles.sectionSubtitle}>Choose the areas where you'd like to focus</Text>

          <View style={styles.servicesGrid}>
            {coachingServices.map((service) => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceButton,
                  selectedServices.includes(service.id) && styles.serviceButtonSelected
                ]}
                onPress={() => toggleService(service.id)}
                onHoverIn={() => setHoveredService(service.id)}
                onHoverOut={() => setHoveredService(null)}
              >
                <Text
                  style={[
                    styles.serviceButtonText,
                    selectedServices.includes(service.id) && styles.serviceButtonTextSelected
                  ]}
                >
                  {service.name}
                </Text>
                {hoveredService === service.id && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{service.description}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Start Your Journey</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    flex: 1,
  },
  content: {
    padding: 24,
  },
  congratsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginTop: -20,
    marginBottom: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  congratsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#4F46E5',
    marginBottom: 12,
    textAlign: 'center',
  },
  congratsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  servicesSection: {
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  serviceButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
    borderWidth: 2,
  },
  serviceButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  serviceButtonTextSelected: {
    color: '#4F46E5',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
    width: 240,
    top: '100%',
    left: '50%',
    transform: [{ translateX: -120 }],
    marginTop: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tooltipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});