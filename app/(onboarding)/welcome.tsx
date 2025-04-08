import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/(auth)')}
          >
            <ArrowLeft color="#ffffff" size={24} />
          </Pressable>
          <Text style={styles.title}>Welcome to 3 Chords Coaching</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>A Message from Our CEO</Text>
          <Text style={styles.messageName}>Donslow Brown</Text>
          <Text style={styles.messageText}>
            "Welcome to 3 Chords Coaching, where transformation meets purpose. Our platform is built on the belief that everyone has the potential for extraordinary growth. Whether you're a professional seeking career advancement, an entrepreneur building your dream, or someone on a journey of personal development, we're here to support your evolution.
            {'\n\n'}
            Our name, '3 Chords,' represents the three pillars of our coaching philosophy: Connection, Growth, and Impact. Together, these create the harmony of successful personal and professional development."
          </Text>
        </View>

        <View style={styles.videoContainer}>
          <Video
            source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-woman-practicing-yoga-at-sunset-4796-large.mp4' }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
        </View>

        <Pressable
          style={styles.subscribeButton}
          onPress={() => router.push("/(auth)/subscription" as any)}
        >
          <Text style={styles.subscribeButtonText}>Explore Our Plans</Text>
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
    padding: 40,
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
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  messageCard: {
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
  messageTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  messageName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4F46E5',
    marginBottom: 16,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },
  videoContainer: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  subscribeButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});