import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronRight, Check, X, HelpCircle } from 'lucide-react-native';
import { useAuth } from '../../context/auth';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { collection, doc, getDocs, setDoc, Timestamp } from 'firebase/firestore';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  capacity: number;
  attendees: {
    [userId: string]: 'yes' | 'no' | 'interested';
  };
}

export default function EventsScreen() {
  const { user, userData } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const createMockEvents = () => {
    return [
      {
        id: 'mock-event-1',
        title: "Leadership Excellence Workshop",
        description: "Join us for an intensive workshop focused on developing key leadership skills. Learn from industry experts about effective communication, team management, and strategic decision-making.",
        startDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)),
        location: "Virtual Conference Room",
        capacity: 50,
        attendees: {}
      },
      {
        id: 'mock-event-2',
        title: "Career Growth Masterclass",
        description: "Discover proven strategies for accelerating your career growth. Topics include personal branding, networking, and identifying opportunities for advancement.",
        startDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
        location: "Innovation Hub, Downtown",
        capacity: 30,
        attendees: {}
      },
      {
        id: 'mock-event-3',
        title: "Business Strategy Summit",
        description: "A comprehensive event covering the latest trends in business strategy, market analysis, and growth opportunities. Network with industry leaders and gain valuable insights.",
        startDate: Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)),
        location: "Grand Conference Center",
        capacity: 100,
        attendees: {}
      },
      {
        id: 'mock-event-4',
        title: "Personal Development Workshop",
        description: "Focus on your personal growth with this interactive workshop. Topics include goal setting, time management, and maintaining work-life balance.",
        startDate: Timestamp.fromDate(new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)),
        location: "Community Learning Center",
        capacity: 40,
        attendees: {}
      },
      {
        id: 'mock-event-5',
        title: "Networking Mixer",
        description: "Connect with fellow professionals in a relaxed setting. Build meaningful relationships and explore collaboration opportunities while enjoying refreshments.",
        startDate: Timestamp.fromDate(new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000)),
        location: "Skyline Lounge",
        capacity: 75,
        attendees: {}
      }
    ] as Event[];
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsRef = collection(FIREBASE_FIRESTORE, 'events');
      const eventsSnapshot = await getDocs(eventsRef);
      let eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        attendees: doc.data().attendees || {},
      })) as Event[];

      // If no events found, use mock data
      if (eventsData.length === 0) {
        console.log('No events found, creating mock data');
        eventsData = createMockEvents();
        // Save mock events to Firestore
        try {
          await Promise.all(eventsData.map(event => {
            const eventRef = doc(FIREBASE_FIRESTORE, 'events', event.id);
            return setDoc(eventRef, {
              title: event.title,
              description: event.description,
              startDate: event.startDate,
              endDate: event.endDate,
              location: event.location,
              capacity: event.capacity,
              attendees: {}
            });
          }));
          console.log('Mock events saved to Firestore');
        } catch (error) {
          console.error('Error saving mock events:', error);
        }
      }

      // Sort events by start date
      setEvents(eventsData.sort((a, b) => 
        a.startDate.toMillis() - b.startDate.toMillis()
      ));
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'yes' | 'no' | 'interested') => {
    if (!user?.uid) return;

    try {
      const eventRef = doc(FIREBASE_FIRESTORE, 'events', eventId);
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: {
              ...(event.attendees || {}),
              [user.uid]: status
            }
          };
        }
        return event;
      });

      await setDoc(eventRef, {
        attendees: {
          [user.uid]: status
        }
      }, { merge: true });

      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      Alert.alert('Error', 'Failed to update RSVP. Please try again.');
    }
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Date not available';
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getAttendeeCount = (attendees: Event['attendees'] = {}) => {
    return Object.values(attendees).filter(status => status === 'yes').length;
  };

  const getUserRSVP = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.attendees?.[user?.uid || ''] || null;
  };

  const renderRSVPButtons = (eventId: string) => {
    const currentRSVP = getUserRSVP(eventId);

    return (
      <View style={styles.rsvpContainer}>
        <Text style={styles.rsvpTitle}>Will you attend?</Text>
        <View style={styles.rsvpButtons}>
          <Pressable
            style={[
              styles.rsvpButton,
              currentRSVP === 'yes' && styles.rsvpButtonSelected,
              styles.rsvpButtonYes
            ]}
            onPress={() => handleRSVP(eventId, 'yes')}
          >
            <Check size={16} color={currentRSVP === 'yes' ? '#ffffff' : '#059669'} />
            <Text style={[
              styles.rsvpButtonText,
              currentRSVP === 'yes' && styles.rsvpButtonTextSelected
            ]}>Yes</Text>
          </Pressable>

          <Pressable
            style={[
              styles.rsvpButton,
              currentRSVP === 'interested' && styles.rsvpButtonSelected,
              styles.rsvpButtonInterested
            ]}
            onPress={() => handleRSVP(eventId, 'interested')}
          >
            <HelpCircle size={16} color={currentRSVP === 'interested' ? '#ffffff' : '#4F46E5'} />
            <Text style={[
              styles.rsvpButtonText,
              currentRSVP === 'interested' && styles.rsvpButtonTextSelected
            ]}>Interested</Text>
          </Pressable>

          <Pressable
            style={[
              styles.rsvpButton,
              currentRSVP === 'no' && styles.rsvpButtonSelected,
              styles.rsvpButtonNo
            ]}
            onPress={() => handleRSVP(eventId, 'no')}
          >
            <X size={16} color={currentRSVP === 'no' ? '#ffffff' : '#DC2626'} />
            <Text style={[
              styles.rsvpButtonText,
              currentRSVP === 'no' && styles.rsvpButtonTextSelected
            ]}>No</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderEvent = (event: Event) => {
    if (!event || !event.startDate || !event.endDate) return null;

    const isExpanded = expandedEvents.includes(event.id);
    const attendeeCount = getAttendeeCount(event.attendees);

    return (
      <Pressable
        key={event.id}
        style={styles.eventCard}
        onPress={() => toggleEventExpansion(event.id)}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventDateBadge}>
            <Text style={styles.eventDateDay}>
              {event.startDate.toDate().getDate()}
            </Text>
            <Text style={styles.eventDateMonth}>
              {event.startDate.toDate().toLocaleString('en-US', { month: 'short' })}
            </Text>
          </View>
          <View style={styles.eventHeaderContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventMeta}>
              <View style={styles.eventMetaItem}>
                <Users size={14} color="#6B7280" />
                <Text style={styles.eventMetaText}>{attendeeCount} attending</Text>
              </View>
              <View style={styles.eventMetaItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.eventMetaText}>{event.location || 'Location TBA'}</Text>
              </View>
            </View>
          </View>
          <ChevronRight
            size={20}
            color="#6B7280"
            style={[
              styles.chevron,
              isExpanded && styles.chevronExpanded
            ]}
          />
        </View>

        {isExpanded && (
          <View style={styles.eventContent}>
            <Text style={styles.eventDescription}>{event.description}</Text>
            
            <View style={styles.eventDetails}>
              <View style={styles.eventDetailItem}>
                <CalendarIcon size={16} color="#6B7280" />
                <View>
                  <Text style={styles.eventDetailLabel}>Start</Text>
                  <Text style={styles.eventDetailText}>{formatDate(event.startDate)}</Text>
                </View>
              </View>
              <View style={styles.eventDetailItem}>
                <Clock size={16} color="#6B7280" />
                <View>
                  <Text style={styles.eventDetailLabel}>End</Text>
                  <Text style={styles.eventDetailText}>{formatDate(event.endDate)}</Text>
                </View>
              </View>
            </View>

            {renderRSVPButtons(event.id)}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Live Events</Text>
          <Text style={styles.subtitle}>
            Join our upcoming events and connect with the community
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events scheduled at the moment.</Text>
          </View>
        ) : (
          events.map(event => renderEvent(event))
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
    padding: 20,
    marginTop: -20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  eventDateBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    minWidth: 48,
  },
  eventDateDay: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#4F46E5',
  },
  eventDateMonth: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  eventHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  chevron: {
    marginLeft: 12,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  eventContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  eventDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#111827',
  },
  rsvpContainer: {
    gap: 12,
  },
  rsvpTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
  },
  rsvpButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rsvpButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  rsvpButtonSelected: {
    borderWidth: 0,
  },
  rsvpButtonYes: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  rsvpButtonInterested: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  rsvpButtonNo: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  rsvpButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  rsvpButtonTextSelected: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 