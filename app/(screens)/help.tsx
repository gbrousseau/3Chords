import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useAuth } from '../../context/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { HelpCircle, ChevronDown } from 'lucide-react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FIREBASE_APP } from '@/firebaseConfig';

const SUPPORT_EMAIL = 'imaweinerdog@gmail.com';

interface SupportEmailResponse {
  email: string;
  success: boolean;
  message?: string;
}

const categories = [
  'Technical Issue',
  'Account Access',
  'Billing',
  'Feature Request',
  'Bug Report',
  'Other'
];

export default function HelpScreen() {
  const { user, userData } = useAuth();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  }>({ type: 'success', message: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);

  const getUserAgent = () => {
    const platform = Platform.OS;
    const version = Platform.Version;
    return `Platform: ${platform}, Version: ${version}`;
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, visible: true });
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!message) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      const functions = getFunctions(FIREBASE_APP);
      const sendSupportEmail = httpsCallable<{ message: string }, SupportEmailResponse>(
        functions,
        'sendSupportEmail',
      );
      const result = await sendSupportEmail({ message });
      
      if (result.data.success) {
        Alert.alert('Success', 'Your message has been sent');
        setMessage('');
      } else {
        Alert.alert('Error', result.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending support email:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {notification.visible && (
        <View style={[
          styles.notification,
          notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
        ]}>
          <Text style={styles.notificationText}>{notification.message}</Text>
        </View>
      )}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <HelpCircle size={48} color="#ffffff" style={styles.headerIcon} />
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>
            We're here to help! Send us your questions or concerns.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.categoryField}>
            <Text style={styles.label}>Category</Text>
            <Pressable
              style={styles.categorySelector}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Text style={styles.categoryText}>
                {category || 'Select a category'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </Pressable>
            {showCategories && (
              <View style={styles.categoriesList}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionSelected
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategories(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      category === cat && styles.categoryOptionTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={`${user?.email} - ${message} - ${getUserAgent()}`}
              onChangeText={setMessage}
              placeholder="Describe your issue in detail"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <Pressable
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Sending...' : 'Send Request'}
            </Text>
          </Pressable>
        </View>
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
    padding: 24,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  form: {
    padding: 24,
    zIndex: 1,
  },
  field: {
    marginBottom: 24,
    position: 'relative',
  },
  categoryField: {
    marginBottom: 24,
    position: 'relative',
    zIndex: 3,
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
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  categorySelector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    zIndex: 3,
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  categoriesList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: -6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#ffffff',
  },
  categoryOptionSelected: {
    backgroundColor: '#EEF2FF',
  },
  categoryOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  categoryOptionTextSelected: {
    color: '#4F46E5',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationSuccess: {
    backgroundColor: '#34D399',
  },
  notificationError: {
    backgroundColor: '#EF4444',
  },
  notificationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
}); 