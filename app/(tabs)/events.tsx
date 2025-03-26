import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  speaker: string;
  type: 'workshop' | 'webinar' | 'coaching';
};

type CalendarDay = {
  date: Date;
  hasEvents: boolean;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const reference = storage().ref('events/events.json');
      const url = await reference.getDownloadURL();
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        hasEvents: events.some(event => event.date === formatDate(d)),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const daysInMonth = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Events</Text>
        <Text style={styles.subtitle}>Join our upcoming sessions</Text>
      </View>

      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <Pressable onPress={handlePrevMonth}>
            <Text style={styles.calendarArrow}>←</Text>
          </Pressable>
          <Text style={styles.calendarTitle}>
            {formatMonthYear(currentMonth)}
          </Text>
          <Pressable onPress={handleNextMonth}>
            <Text style={styles.calendarArrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.weekDays}>
          {weekDays.map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {daysInMonth.map((day, index) => {
            const dateString = formatDate(day.date);
            const isSelected = dateString === selectedDate;
            const hasEvents = day.hasEvents;

            return (
              <Pressable
                key={index}
                style={[
                  styles.dayCell,
                  isSelected && styles.selectedDay,
                  isToday(day.date) && styles.today,
                ]}
                onPress={() => setSelectedDate(dateString)}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isToday(day.date) && styles.todayText,
                ]}>
                  {day.date.getDate()}
                </Text>
                {hasEvents && <View style={styles.eventDot} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.eventsList}>
        {getEventsForDate(selectedDate).map(event => (
          <Pressable key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventDuration}>{event.duration}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <View style={styles.eventFooter}>
              <Text style={styles.eventSpeaker}>Speaker: {event.speaker}</Text>
              <View style={[styles.eventType, { backgroundColor: getEventTypeColor(event.type) }]}>
                <Text style={styles.eventTypeText}>{event.type}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'workshop':
      return '#EEF2FF';
    case 'webinar':
      return '#FEF3C7';
    case 'coaching':
      return '#D1FAE5';
    default:
      return '#F3F4F6';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  calendar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  calendarArrow: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#4F46E5',
    padding: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDay: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#4F46E5',
  },
  today: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  todayText: {
    color: '#4F46E5',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4F46E5',
  },
  eventsList: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4F46E5',
  },
  eventDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventSpeaker: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  eventType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
    textTransform: 'capitalize',
  },
}); 