import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft 
} from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 'welcome',
    title: 'Welcome to 3 Cords Coaching',
    description: 'Your journey to personal and professional growth starts here. We believe in the power of connection, guidance, and transformation.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
    gradient: ['#4F46E5', '#7C3AED'] as const,
  },
  {
    id: 'platform',
    title: 'Transform Your Potential',
    description: 'Join our community of successful professionals who have achieved their goals through personalized coaching and mentorship.',
    video: true,
    testimonials: [
      {
        name: 'Sarah Chen',
        role: 'Tech Executive',
        text: '"3 Cords Coaching helped me break through my career ceiling. The guidance was invaluable."',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      },
      {
        name: 'Marcus Johnson',
        role: 'Entrepreneur',
        text: '"The structured approach and expert mentorship transformed my business vision into reality."',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      },
    ],
    gradient: ['#3730A3', '#6366F1'] as const,
  },
  {
    id: 'founder',
    title: 'A Message from Our Founder',
    founderName: 'Donslow Brown',
    founderTitle: 'Founder & CEO',
    message: 'At 3 Cords Coaching, we believe that everyone has untapped potential waiting to be discovered. Our pledge is to provide world-class coaching that transforms lives, builds leaders, and creates lasting impact.',
    founderImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    gradient: ['#1E40AF', '#3B82F6'] as const,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(onboarding)/subscription');
    }
  };

  const renderSlide = () => {
    const slide = slides[currentIndex];

    return (
      <Animated.View 
        key={slide.id}
        entering={SlideInRight}
        exiting={SlideOutLeft}
        style={styles.slideContainer}
      >
        <LinearGradient
          colors={slide.gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {slide.id === 'welcome' && (
            <Image
              source={{ uri: slide.image }}
              style={styles.backgroundImage}
            />
          )}

          <View style={styles.content}>
            <Text style={styles.title}>{slide.title}</Text>
            {slide.description && (
              <Text style={styles.description}>{slide.description}</Text>
            )}
          
            {slide.id === 'platform' && (
              <View style={styles.testimonialContainer}>
                <Video
                  ref={videoRef}
                  source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-business-team-meeting-in-an-office-4819-large.mp4' }}
                  style={styles.video}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  isMuted
                  shouldPlay
                />
                <View style={styles.testimonials}>
                  {slide.testimonials?.map((testimonial, index) => (
                    <Animated.View
                      key={testimonial.name}
                      entering={FadeIn.delay(index * 500)}
                      exiting={FadeOut}
                      style={styles.testimonialCard}
                    >
                      <Image
                        source={{ uri: testimonial.avatar }}
                        style={styles.testimonialAvatar}
                      />
                      <View style={styles.testimonialContent}>
                        <Text style={styles.testimonialText}>{testimonial.text}</Text>
                        <Text style={styles.testimonialName}>{testimonial.name}</Text>
                        <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}

            {slide.id === 'founder' && (
              <View style={styles.founderContainer}>
                <Image
                  source={{ uri: slide.founderImage }}
                  style={styles.founderImage}
                />
                <View style={styles.founderContent}>
                  <Text style={styles.founderName}>{slide.founderName}</Text>
                  <Text style={styles.founderTitle}>{slide.founderTitle}</Text>
                  <Text style={styles.founderMessage}>{slide.message}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
            <Pressable 
              style={styles.button} 
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <ArrowRight size={20} color="#4F46E5" />
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSlide()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 48,
    zIndex: 2,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 600,
    alignSelf: 'center',
    marginBottom: 32,
    zIndex: 2,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    opacity: 1,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#4F46E5',
  },
  testimonialContainer: {
    flex: 1,
    marginTop: 16,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    zIndex: 1,
  },
  testimonials: {
    padding: 16,
    gap: 16,
    zIndex: 2,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backdropFilter: 'blur(12px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  testimonialAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  testimonialContent: {
    flex: 1,
  },
  testimonialText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  testimonialName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  testimonialRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E0E7FF',
  },
  founderContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 16,
    zIndex: 2,
  },
  founderImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#ffffff',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  founderContent: {
    alignItems: 'center',
    maxWidth: 600,
  },
  founderName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  founderTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E0E7FF',
    marginBottom: 24,
  },
  founderMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
  },
});