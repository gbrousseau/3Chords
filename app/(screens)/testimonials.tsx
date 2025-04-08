import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Quote } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  testimonial: string;
  date: string;
  service: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    company: 'TechVision Solutions',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    testimonial: "Working with 3 Cords Coaching transformed my leadership approach completely. The personalized guidance helped me navigate complex organizational challenges and develop a more empathetic management style. The results have been remarkable - improved team productivity and stronger workplace relationships.",
    date: '2024-03-15',
    service: 'Executive Leadership'
  },
  {
    id: 'test-2',
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    company: 'InnovateLab',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    testimonial: "The business strategy coaching I received was invaluable. My coach helped me refine my business model, identify growth opportunities, and develop a clear roadmap for success. Within six months, we've doubled our customer base and secured significant funding.",
    date: '2024-03-10',
    service: 'Business Strategy'
  },
  {
    id: 'test-3',
    name: 'Emily Rodriguez',
    role: 'Senior Product Manager',
    company: 'GlobalTech Inc.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    testimonial: "The career development program exceeded my expectations. Through targeted coaching sessions, I gained clarity on my professional goals and developed the confidence to pursue higher responsibilities. Recently promoted to a senior position, I credit much of my success to this coaching experience.",
    date: '2024-03-05',
    service: 'Career Development'
  },
  {
    id: 'test-4',
    name: 'David Kim',
    role: 'Team Lead',
    company: 'Cloud Systems',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    testimonial: "The team leadership coaching program provided practical strategies that I could implement immediately. The focus on emotional intelligence and conflict resolution has helped me build a more cohesive and high-performing team. Our productivity metrics have improved significantly.",
    date: '2024-02-28',
    service: 'Team Leadership'
  },
  {
    id: 'test-5',
    name: 'Lisa Thompson',
    role: 'Marketing Director',
    company: 'Creative Solutions',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    testimonial: "The personal development coaching has been transformative. Beyond career growth, it helped me achieve better work-life balance and develop resilience in facing challenges. The holistic approach to coaching has impacted all areas of my life positively.",
    date: '2024-02-20',
    service: 'Personal Development'
  }
];

export default function TestimonialsScreen() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsRef = collection(FIREBASE_FIRESTORE, 'testimonials');
      const testimonialsSnapshot = await getDocs(testimonialsRef);
      const testimonialsData = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];

      if (testimonialsData.length === 0) {
        setTestimonials(mockTestimonials);
      } else {
        setTestimonials(testimonialsData);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials(mockTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            fill={index < rating ? '#FCD34D' : 'transparent'}
            color={index < rating ? '#FCD34D' : '#E5E7EB'}
          />
        ))}
      </View>
    );
  };

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 200)}
        style={styles.testimonialCard}
      >
        <View style={styles.testimonialHeader}>
          <Image
            source={{ uri: testimonial.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{testimonial.name}</Text>
            <Text style={styles.userRole}>{testimonial.role}</Text>
            <Text style={styles.userCompany}>{testimonial.company}</Text>
          </View>
          {renderRatingStars(testimonial.rating)}
        </View>

        <View style={styles.testimonialContent}>
          <Quote size={24} color="#4F46E5" style={styles.quoteIcon} />
          <Text style={styles.testimonialText}>
            {testimonial.testimonial}
          </Text>
        </View>

        <View style={styles.testimonialFooter}>
          <View style={styles.serviceBadge}>
            <Text style={styles.serviceText}>{testimonial.service}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(testimonial.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </Animated.View>
    );
  };
console.log(testimonials)
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <Animated.View 
          entering={FadeInRight}
          style={styles.headerContent}
        >
          <Text style={styles.title}>Success Stories</Text>
          <Text style={styles.subtitle}>
            Discover how our coaching has transformed careers and lives
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading testimonials...</Text>
          </View>
        ) : (
          <View style={styles.testimonialsList}>
            {testimonials.map((testimonial, index) => (
              renderTestimonialCard(testimonial, index)
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E7FF',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  testimonialsList: {
    padding: 20,
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 2,
  },
  userRole: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  userCompany: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialContent: {
    marginBottom: 16,
  },
  quoteIcon: {
    marginBottom: 12,
    opacity: 0.8,
  },
  testimonialText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  serviceBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  serviceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
}); 