import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/auth';
import { BookOpen, Calendar, Clock, FileText, CircleHelp as HelpCircle, Info, MessageSquare, Mic, Search, Star, Target, Users, Video, CreditCard, Edit2, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from '@/firebaseConfig';

export default function HomeScreen() {
  const { user, userData } = useAuth();
  
  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!userData?.subscription) {
    return (
      <View style={styles.subscriptionContainer}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.subscriptionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.subscriptionContent}>
            <CreditCard size={72} color="#ffffff" style={styles.subscriptionIcon} />
            <Text style={styles.subscriptionTitle}>Unlock Premium Features</Text>
            <Text style={styles.subscriptionDescription}>
              Subscribe to access all coaching resources, personalized sessions, and exclusive content.
            </Text>
            <Link href="/(onboarding)" asChild>
              <Pressable style={styles.subscriptionButton}>
                <Text style={styles.subscriptionButtonText}>Choose a Plan</Text>
              </Pressable>
            </Link>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {userData?.services?.length === 0 && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>To make the most of 3 Cords Coaching, please select your services.</Text>
            <Pressable style={styles.overlayButton} onPress={() => router.replace('/assessment')}>
              <Text style={styles.overlayButtonText}>Go to Assessment</Text>
            </Pressable>
          </View>
        )}
        
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{userData?.firstName} {userData?.lastName || 'User'}</Text>
            </View>
            <View style={styles.headerActions}>
              <Link href="/(screens)/profile" asChild>
                <Pressable style={styles.avatarContainer}>
                  <Image
                    source={{ uri: userData?.profilePic_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }}
                    style={styles.avatar}
                  />
                  <View style={styles.editIconContainer}>
                    <Edit2 size={12} color="#ffffff" />
                  </View>
                </Pressable>
              </Link>
              <Pressable 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LogOut size={20} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickGrid}>
              <Link href="/(screens)/rooms" asChild>
                <Pressable style={styles.quickCard}>
                  <MessageSquare size={28} color="#4F46E5" />
                  <Text style={styles.quickText}>Coaching Rooms</Text>
                </Pressable>
              </Link>
              <Link href="/(screens)/accountability" asChild>
                <Pressable style={styles.quickCard}>
                  <Clock size={28} color="#4F46E5" />
                  <Text style={styles.quickText}>Accountability</Text>
                </Pressable>
              </Link>
              <Link href="/(screens)/videos" asChild>
                <Pressable style={styles.quickCard}>
                  <Video size={28} color="#4F46E5" />
                  <Text style={styles.quickText}>Topic Videos</Text>
                </Pressable>
              </Link>
              <Link href="/(screens)/events" asChild>
                <Pressable style={styles.quickCard}>
                  <Calendar size={28} color="#4F46E5" />
                  <Text style={styles.quickText}>Live Events</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.journeyGrid}>
              <Link href="/(screens)/journal" asChild>
                <Pressable style={styles.journeyCard}>
                  <BookOpen size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Journey Journal</Text>
                    <Text style={styles.cardSubtext}>Document your growth</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/assignments" asChild>
                <Pressable style={styles.journeyCard}>
                  <FileText size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Assignments</Text>
                    <Text style={styles.cardSubtext}>Track your progress</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/goals" asChild>
                <Pressable style={styles.journeyCard}>
                  <Target size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Goal Tracker</Text>
                    <Text style={styles.cardSubtext}>Set & achieve goals</Text>
                  </View>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community</Text>
            <View style={styles.communityGrid}>
              <Link href="/(screens)/search" asChild>
                <Pressable style={styles.communityCard}>
                  <Search size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Profile Search</Text>
                    <Text style={styles.cardSubtext}>Connect with peers</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Premium</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/shoutouts" asChild>
                <Pressable style={styles.communityCard}>
                  <Star size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Shoutout Corner</Text>
                    <Text style={styles.cardSubtext}>Celebrate wins</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Standard+</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/testimonials" asChild>
                <Pressable style={styles.communityCard}>
                  <Users size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Testimonials</Text>
                    <Text style={styles.cardSubtext}>Success stories</Text>
                  </View>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.resourcesGrid}>
              <Link href="/(screens)/speaker-request" asChild>
                <Pressable style={styles.resourceCard}>
                  <Mic size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Speaker Request</Text>
                    <Text style={styles.cardSubtext}>Book a speaker</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/help" asChild>
                <Pressable style={styles.resourceCard}>
                  <HelpCircle size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Help & Support</Text>
                    <Text style={styles.cardSubtext}>Get assistance</Text>
                  </View>
                </Pressable>
              </Link>
              <Link href="/(screens)/about" asChild>
                <Pressable style={styles.resourceCard}>
                  <Info size={28} color="#4F46E5" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>About Us</Text>
                    <Text style={styles.cardSubtext}>Our mission</Text>
                  </View>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: 24,
  },
  overlayText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  overlayButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  overlayButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  editIconContainer: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 20,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
    textAlign: 'center',
  },
  journeyGrid: {
    gap: 16,
  },
  journeyCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  communityGrid: {
    gap: 16,
  },
  communityCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#4F46E5',
  },
  resourcesGrid: {
    gap: 16,
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  subscriptionContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 24,
    justifyContent: 'center',
  },
  subscriptionGradient: {
    borderRadius: 32,
    padding: 32,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  subscriptionContent: {
    alignItems: 'center',
    gap: 20,
  },
  subscriptionIcon: {
    marginBottom: 8,
    opacity: 0.9,
  },
  subscriptionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
  },
  subscriptionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 26,
  },
  subscriptionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  subscriptionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#4F46E5',
  },
}); 