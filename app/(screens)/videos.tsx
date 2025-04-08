import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Play, X, ChevronRight, Clock } from 'lucide-react-native';
import { coachingServices } from '../../constants/coachingServices';
import { useAuth } from '../../context/auth';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  serviceId: string;
  url: string;
}

// Mock data for videos - replace with actual data from your backend
const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Leadership Fundamentals',
    description: 'Learn the core principles of effective leadership and team management.',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop',
    duration: '15:30',
    serviceId: 'leadership',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-business-team-meeting-in-an-office-4819-large.mp4',
  },
  {
    id: '2',
    title: 'Career Development Strategies',
    description: 'Strategic approaches to advancing your professional career.',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2940&auto=format&fit=crop',
    duration: '12:45',
    serviceId: 'career',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-business-team-meeting-in-an-office-4819-large.mp4',
  },
  {
    id: '3',
    title: 'Personal Growth Mindset',
    description: 'Developing a growth mindset for continuous personal development.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2940&auto=format&fit=crop',
    duration: '18:20',
    serviceId: 'personal',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-business-team-meeting-in-an-office-4819-large.mp4',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus padding

export default function VideosScreen() {
  const { userData } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const renderVideoModal = () => {
    if (!selectedVideo) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedVideo(null)}
          >
            <X size={24} color="#ffffff" />
          </Pressable>
          <Video
            source={{ uri: selectedVideo.url }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
            <Text style={styles.videoDescription}>{selectedVideo.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderVideoCard = (video: VideoItem) => (
    <Pressable
      key={video.id}
      style={styles.videoCard}
      onPress={() => setSelectedVideo(video)}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.thumbnailOverlay}
        />
        <View style={styles.playButton}>
          <Play size={24} color="#ffffff" />
        </View>
        <View style={styles.duration}>
          <Clock size={12} color="#ffffff" />
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={1}>
          {video.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {video.description}
        </Text>
      </View>
    </Pressable>
  );

  const renderServiceVideos = () => {
    return coachingServices.map(service => {
      const serviceVideos = mockVideos.filter(video => video.serviceId === service.id);
      if (serviceVideos.length === 0) return null;

      const isExpanded = expandedServices.includes(service.id);

      return (
        <View key={service.id} style={styles.serviceSection}>
          <Pressable
            style={styles.serviceTitleContainer}
            onPress={() => toggleServiceExpansion(service.id)}
          >
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <ChevronRight
              size={20}
              color="#4B5563"
              style={[
                styles.chevron,
                isExpanded && styles.chevronExpanded
              ]}
            />
          </Pressable>
          {isExpanded && (
            <View style={styles.videoGrid}>
              {serviceVideos.map(video => renderVideoCard(video))}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Topic Videos</Text>
          <Text style={styles.subtitle}>
            Expand your knowledge with our curated video content
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {renderServiceVideos()}
      </ScrollView>

      {renderVideoModal()}
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
    padding: 20,
    marginTop: -20,
  },
  serviceSection: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  videoGrid: {
    marginTop: 16,
    gap: 16,
  },
  videoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#ffffff',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  videoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
    padding: 8,
  },
  videoPlayer: {
    width: '100%',
    height: 300,
  },
}); 