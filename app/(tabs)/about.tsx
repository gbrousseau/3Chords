import { Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED'] as const}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>About Us</Text>

        <Text style={styles.paragraph}>
          Welcome to 3 Cords Coaching, where extraordinary growth begins.
        </Text>

        <Text style={styles.paragraph}>
          We are a dynamic life coaching and speaking platform dedicated to empowering individuals and groups to unlock their fullest potential. At the heart of what we do is our unwavering belief that every person possesses the ability to achieve extraordinary transformation and growth—no matter where they are in life.
        </Text>

        <Text style={styles.paragraph}>
          At 3 Chords, we bridge the gap between ambition and action. Our platform provides a space for skilled coaches and inspiring speakers to connect with clients for personalized one-on-one sessions or impactful group engagements. Whether you're seeking tailored guidance to navigate life's challenges, or shared wisdom to uplift and inspire, we are here to guide you every step of the way.
        </Text>

        <Text style={styles.paragraph}>
          Our mission is simple yet profound: to foster growth, ignite passions, and create meaningful change. By connecting the right voices to the right ears, we aim to empower individuals to embrace their own extraordinary journey.
        </Text>

        <Text style={styles.paragraph}>
          Join us, and let's create a future where growth knows no bounds.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  paragraph: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E7FF',
    lineHeight: 24,
    marginBottom: 16,
  },
}); 