import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { BookOpen, Calendar, Clock, FileText, CircleHelp as HelpCircle, Info, MessageSquare, Mic, Search, Star, Target, Users, Video, Edit2 } from 'lucide-react-native';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>Sarah Johnson</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          <Link href="./rooms" asChild>
            <Pressable style={styles.quickCard}>
              <MessageSquare size={24} color="#4F46E5" />
              <Text style={styles.quickText}>Coaching Rooms</Text>
            </Pressable>
          </Link>
          <Link href="./accountability" asChild>
            <Pressable style={styles.quickCard}>
              <Clock size={24} color="#4F46E5" />
              <Text style={styles.quickText}>Accountability</Text>
            </Pressable>
          </Link>
          <Link href="./videos" asChild>
            <Pressable style={styles.quickCard}>
              <Video size={24} color="#4F46E5" />
              <Text style={styles.quickText}>Topic Videos</Text>
            </Pressable>
          </Link>
          <Link href="./events" asChild>
            <Pressable style={styles.quickCard}>
              <Calendar size={24} color="#4F46E5" />
              <Text style={styles.quickText}>Live Events</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <View style={styles.journeyGrid}>
          <Link href="./journal" asChild>
            <Pressable style={styles.journeyCard}>
              <BookOpen size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Journey Journal</Text>
              <Text style={styles.cardSubtext}>Document your growth</Text>
            </Pressable>
          </Link>
          <Link href="./assignments" asChild>
            <Pressable style={styles.journeyCard}>
              <FileText size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Assignments</Text>
              <Text style={styles.cardSubtext}>Track your progress</Text>
            </Pressable>
          </Link>
          <Link href="./goals" asChild>
            <Pressable style={styles.journeyCard}>
              <Target size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Goal Tracker</Text>
              <Text style={styles.cardSubtext}>Set & achieve goals</Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/assessment?edit=true" asChild>
            <Pressable style={styles.journeyCard}>
              <Edit2 size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Edit Assessment</Text>
              <Text style={styles.cardSubtext}>Update your profile</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community</Text>
        <View style={styles.communityGrid}>
          <Link href="./search" asChild>
            <Pressable style={styles.communityCard}>
              <Search size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Profile Search</Text>
              <Text style={styles.cardSubtext}>Connect with peers</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Premium</Text>
              </View>
            </Pressable>
          </Link>
          <Link href="./shoutouts" asChild>
            <Pressable style={styles.communityCard}>
              <Star size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Shoutout Corner</Text>
              <Text style={styles.cardSubtext}>Celebrate wins</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Standard+</Text>
              </View>
            </Pressable>
          </Link>
          <Link href="./testimonials" asChild>
            <Pressable style={styles.communityCard}>
              <Users size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Testimonials</Text>
              <Text style={styles.cardSubtext}>Success stories</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <View style={styles.resourcesGrid}>
          <Link href="./speaker-request" asChild>
            <Pressable style={styles.resourceCard}>
              <Mic size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Speaker Request</Text>
              <Text style={styles.cardSubtext}>Book a speaker</Text>
            </Pressable>
          </Link>
          <Link href="./help" asChild>
            <Pressable style={styles.resourceCard}>
              <HelpCircle size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Help & Support</Text>
              <Text style={styles.cardSubtext}>Get assistance</Text>
            </Pressable>
          </Link>
          <Link href="./about" asChild>
            <Pressable style={styles.resourceCard}>
              <Info size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>About Us</Text>
              <Text style={styles.cardSubtext}>Our mission</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  journeyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  journeyCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  communityGrid: {
    gap: 12,
  },
  communityCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  cardSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resourceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});