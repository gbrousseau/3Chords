import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { MessageSquare, Linkedin, Mail } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Our Mission</Text>
          <Text style={styles.subtitle}>
            Empowering individuals to unlock their full potential through personalized coaching and mentorship.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About 3 Cords Coaching</Text>
          <Text style={styles.text}>
            At 3 Cords Coaching, we believe that transformative growth happens when knowledge, 
            guidance, and personal commitment come together. Our platform connects ambitious 
            professionals with experienced coaches who are dedicated to helping them achieve 
            their goals.
          </Text>
          <Text style={styles.text}>
            We focus on delivering personalized coaching experiences across various domains 
            including leadership development, career advancement, and personal growth. Our 
            innovative approach combines one-on-one coaching, group sessions, and digital 
            resources to create a comprehensive development journey.
          </Text>
        </View>

        <View style={styles.leadershipSection}>
          <Text style={styles.sectionTitle}>Our Leadership</Text>
          <View style={styles.leaderCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop' }}
              style={styles.leaderImage}
            />
            <Text style={styles.leaderName}>Donslow Brown</Text>
            <Text style={styles.leaderTitle}>Founder & CEO</Text>
            <Text style={styles.leaderBio}>
              With over 15 years of experience in leadership development and executive coaching, 
              Donslow Brown founded 3 Cords Coaching with a vision to make professional coaching 
              accessible to everyone. His approach combines traditional mentorship principles 
              with modern technology to create transformative coaching experiences.
            </Text>
            <View style={styles.socialLinks}>
              <Pressable 
                style={styles.socialButton}
                onPress={() => Linking.openURL('mailto:donslow@3cords.com')}
              >
                <Mail size={20} color="#4F46E5" />
              </Pressable>
              <Pressable 
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://linkedin.com/in/donslowbrown')}
              >
                <Linkedin size={20} color="#4F46E5" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueCards}>
            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Personal Growth</Text>
              <Text style={styles.valueText}>
                We believe in continuous improvement and lifelong learning.
              </Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Excellence</Text>
              <Text style={styles.valueText}>
                We maintain high standards in our coaching and service delivery.
              </Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Innovation</Text>
              <Text style={styles.valueText}>
                We leverage technology to enhance the coaching experience.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
          <Text style={styles.ctaText}>
            Connect with our team to learn more about how we can help you achieve your goals.
          </Text>
          <Link href="/(screens)/rooms" asChild>
            <Pressable style={styles.ctaButton}>
              <MessageSquare size={20} color="#ffffff" />
              <Text style={styles.ctaButtonText}>Start a Conversation</Text>
            </Pressable>
          </Link>
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
    paddingBottom: 40,
  },
  headerContent: {
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E0E7FF',
    lineHeight: 28,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  leadershipSection: {
    marginBottom: 40,
  },
  leaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leaderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  leaderName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 4,
  },
  leaderTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  leaderBio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
  },
  valueCards: {
    gap: 16,
  },
  valueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  valueTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  valueText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  ctaSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  ctaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
}); 