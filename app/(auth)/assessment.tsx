import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthContext } from '../context/AuthContext';
import { createUserProfile, getUserProfile, updateUserProfile } from '../services/userProfile';
import { AssessmentData } from '../types/user';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts, getPlatformFontFamily, createSafeStyles } from '../utils/fonts';

const coachingServices = [
  'Career Development',
  'Leadership Skills',
  'Personal Growth',
  'Work-Life Balance',
  'Communication Skills',
  'Time Management',
  'Stress Management',
  'Goal Setting',
];

const createStyles = (fontsLoaded: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'bold'),
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'medium'),
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  question: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'semiBold'),
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
  },
  optionText: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'medium'),
    fontSize: 16,
    color: '#ffffff',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'semiBold'),
    fontSize: 16,
    color: '#4F46E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  editButtonText: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'semiBold', 'system'),
    fontSize: 14,
    color: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'semiBold'),
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    width: '48%',
  },
  serviceCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  serviceCardReadOnly: {
    opacity: 0.7,
  },
  serviceText: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'medium'),
    fontSize: 14,
    color: '#ffffff',
  },
  serviceTextSelected: {
    color: '#4F46E5',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontFamily: getPlatformFontFamily(fontsLoaded, 'medium'),
    fontSize: 16,
  },
  inputReadOnly: {
    opacity: 0.7,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontFamily: getPlatformFontFamily(fontsLoaded, 'semiBold'),
    fontSize: 16,
    color: '#ffffff',
  },
});

export default function AssessmentScreen() {
  const { user } = useAuthContext();
  const { edit } = useLocalSearchParams();
  const [isEditMode, setIsEditMode] = useState(edit === 'true');
  const [isReadOnly, setIsReadOnly] = useState(!isEditMode);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState('');
  const [description, setDescription] = useState('');

  const fontsLoaded = useAppFonts();
  const styles = createSafeStyles(fontsLoaded, createStyles);

  useEffect(() => {
    if (!isEditMode) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [isEditMode]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setSelectedServices(profile.selectedServices);
        setIntroduction(profile.introduction);
        setDescription(profile.description);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: string) => {
    if (isReadOnly) return;
    
    setSelectedServices((prev: string[]) => {
      if (prev.includes(service)) {
        return prev.filter((s: string) => s !== service);
      }
      return [...prev, service];
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const assessmentData: AssessmentData = {
        introduction,
        description,
        selectedServices,
      };

      if (isEditMode) {
        await updateUserProfile(user.uid, assessmentData);
        Alert.alert('Success', 'Your profile has been updated');
      } else {
        await createUserProfile(user.uid, user.email!, assessmentData);
        Alert.alert('Success', 'Your profile has been created');
      }

      setIsReadOnly(true);
      setIsEditMode(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save your profile');
    }
  };

  const handleEdit = () => {
    setIsReadOnly(false);
    setIsEditMode(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Assessment</Text>
        {isReadOnly && (
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={20} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Coaching Services</Text>
        <View style={styles.servicesGrid}>
          {coachingServices.map((service) => (
            <Pressable
              key={service}
              style={[
                styles.serviceCard,
                selectedServices.includes(service) && styles.serviceCardSelected,
                isReadOnly && styles.serviceCardReadOnly,
              ]}
              onPress={() => toggleService(service)}
              disabled={isReadOnly}
            >
              <Text
                style={[
                  styles.serviceText,
                  selectedServices.includes(service) && styles.serviceTextSelected,
                ]}
              >
                {service}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <TextInput
          style={[styles.input, isReadOnly && styles.inputReadOnly]}
          value={introduction}
          onChangeText={setIntroduction}
          placeholder="Tell us about yourself..."
          multiline
          numberOfLines={4}
          editable={!isReadOnly}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You Want to Achieve</Text>
        <TextInput
          style={[styles.input, isReadOnly && styles.inputReadOnly]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your goals and what you want to achieve..."
          multiline
          numberOfLines={6}
          editable={!isReadOnly}
        />
      </View>

      {!isReadOnly && (
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Save Changes' : 'Submit Assessment'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}