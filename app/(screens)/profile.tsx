import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/auth';
import { Camera, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { coachingServices } from '@/constants/coachingServices';

export default function ProfileScreen() {
  const { user, userData } = useAuth();
  const [name, setName] = useState(`${userData?.firstName || ''} ${userData?.lastName || ''}`);
  const [bio, setBio] = useState('Tech executive passionate about leadership and personal growth.');
  const [email, setEmail] = useState(userData?.email || '');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(userData?.services || []);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes by comparing current values with initial values
  useEffect(() => {
    const initialName = `${userData?.firstName || ''} ${userData?.lastName || ''}`;
    const initialEmail = userData?.email || '';
    const initialServices = userData?.services || [];
    const initialImageUri = userData?.profilePic_url;

    const hasNameChanged = name !== initialName;
    const hasEmailChanged = email !== initialEmail;
    const hasServicesChanged = JSON.stringify(selectedServices) !== JSON.stringify(initialServices);
    const hasImageChanged = localImageUri !== null;
    const hasBioChanged = bio !== 'Tech executive passionate about leadership and personal growth.';

    setHasChanges(
      hasNameChanged || 
      hasEmailChanged || 
      hasServicesChanged || 
      hasImageChanged ||
      hasBioChanged
    );
  }, [name, email, selectedServices, localImageUri, bio, userData]);

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setLocalImageUri(uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    try {
      if (!userData?.id || !hasChanges) return;

      const [firstName, lastName] = name.split(' ');
      const userRef = doc(FIREBASE_FIRESTORE, 'users', userData.id);
      
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        bio,
        profilePic_url: localImageUri || userData?.profilePic_url,
        services: selectedServices
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: localImageUri || 
              userData?.profilePic_url || 
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' 
            }}
            style={styles.avatar}
          />
          <Pressable 
            style={styles.cameraButton} 
            onPress={handleImageUpload}
            disabled={uploading}
          >
            <Camera size={20} color="#000" />
          </Pressable>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Coaching Services</Text>
          <Text style={styles.serviceDescription}>Select the services you're interested in</Text>
          <View style={styles.servicesGrid}>
            {coachingServices.map(service => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceButton,
                  selectedServices.includes(service.id) && styles.serviceButtonSelected
                ]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={[
                  styles.serviceButtonText,
                  selectedServices.includes(service.id) && styles.serviceButtonTextSelected
                ]}>
                  {service.name}
                </Text>
                {selectedServices.includes(service.id) && (
                  <Check 
                    size={16} 
                    color="#ffffff" 
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable 
          style={[styles.button, !hasChanges && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={[styles.buttonText, !hasChanges && styles.buttonTextDisabled]}>
            Save Changes
          </Text>
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
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  form: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  field: {
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
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
  serviceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '45%',
  },
  serviceButtonSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  serviceButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  serviceButtonTextSelected: {
    color: '#ffffff',
  },
  checkIcon: {
    marginLeft: 8,
  },
}); 