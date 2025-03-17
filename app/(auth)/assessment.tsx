import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Info } from 'lucide-react-native';

const coachingServices = [
  {
    id: 'career',
    name: 'Career',
    description: 'Guidance on career choices, job search strategies, and professional development.',
  },
  {
    id: 'health',
    name: 'Health and Wellness',
    description: 'Support for achieving health goals, such as weight loss, fitness, and stress management.',
  },
  {
    id: 'relationship',
    name: 'Relationship',
    description: 'Assistance with improving personal and professional relationships.',
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Advice on budgeting, saving, investing, and overall financial management.',
  },
  {
    id: 'life-balance',
    name: 'Life Balance',
    description: 'Strategies for creating a balanced and fulfilling life.',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Leadership development and performance enhancement for executives and managers.',
  },
  {
    id: 'confidence',
    name: 'Confidence',
    description: 'Building self-esteem and confidence to achieve personal and professional goals.',
  },
  {
    id: 'time',
    name: 'Time Management',
    description: 'Techniques for effective time management and productivity.',
  },
  {
    id: 'stress',
    name: 'Stress Management',
    description: 'Coping strategies to manage and reduce stress.',
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    description: 'Guidance on spiritual growth and finding inner peace.',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Techniques to increase mindfulness and present-moment awareness.',
  },
  {
    id: 'parenting',
    name: 'Parenting',
    description: 'Support for effective parenting strategies and improving family dynamics.',
  },
  {
    id: 'motivation',
    name: 'Motivation',
    description: 'Techniques to stay motivated and achieve goals.',
  },
  {
    id: 'personal',
    name: 'Personal Development',
    description: 'Focus on self-improvement and achieving one\'s potential.',
  },
  {
    id: 'speaking',
    name: 'Public Speaking',
    description: 'Improving public speaking and communication skills.',
  },
  {
    id: 'entrepreneurial',
    name: 'Entrepreneurial',
    description: 'Guidance for starting and growing a business.',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    description: 'Unleashing creativity and fostering innovation.',
  },
  {
    id: 'retirement',
    name: 'Retirement',
    description: 'Planning for a fulfilling and purposeful retirement.',
  },
  {
    id: 'purpose',
    name: 'Life Purpose',
    description: 'Discovering one\'s life purpose and passions.',
  },
  {
    id: 'holistic',
    name: 'Holistic Life',
    description: 'Integrating all aspects of life for overall well-being.',
  },
];

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

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      introduction,
      description,
      selectedServices,
    });
    // Navigate to next screen
    router.push('/(tabs)');
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
          <Text style={styles.title}>Personal Assessment</Text>
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
    padding: 24,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  congratsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  congratsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#4F46E5',
    marginBottom: 12,
  },
  congratsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  servicesSection: {
    marginBottom: 32,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    minWidth: '30%',
    alignItems: 'center',
    position: 'relative',
  },
  serviceButtonSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  serviceButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  serviceButtonTextSelected: {
    color: '#ffffff',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    width: 200,
    top: '100%',
    left: '50%',
    transform: [{ translateX: -100 }],
    marginTop: 8,
    zIndex: 1000,
  },
  tooltipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});