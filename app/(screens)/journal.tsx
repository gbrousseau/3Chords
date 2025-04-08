import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { useAuth } from '../../context/auth';
import { ChevronDown, Plus, X, Calendar, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

type JournalEntry = {
  id: string;
  userId: string;
  entry: string;
  timestamp: Date;
  goalId?: string;
}

export default function JournalScreen() {
  const { user, userData, goals } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>();
  const [newEntry, setNewEntry] = useState('');
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    const entriesRef = doc(FIREBASE_FIRESTORE, 'journal_entries', user.uid);
    const docSnap = await getDoc(entriesRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setEntries(data.entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
    setIsLoading(false);
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim() || !user?.uid) return;
    setIsLoading(true);

    const entry: JournalEntry = {
      id: Date.now().toString(),
      userId: user.uid,
      entry: newEntry.trim(),
      timestamp: new Date(),
      goalId: selectedGoal || "No goal",
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);

    const entriesRef = doc(FIREBASE_FIRESTORE, 'journal_entries', user.uid);

    await setDoc(entriesRef, {
      entries: updatedEntries.map(e => ({
        ...e,
        timestamp: e.timestamp?.toISOString() || e.timestamp?.toString() || e.timestamp?.toLocaleString() || null
      }))
    }, { merge: true });

    setIsLoading(false);
    setModalVisible(false);
    setNewEntry('');
    setSelectedGoal(undefined);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Journey Journal</Text>
          <Text style={styles.subtitle}>Document your growth and reflections</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.entryDate}>{formatDate(entry.timestamp)}</Text>
            </View>
            <Text style={styles.entryText}>{entry.entry}</Text>
            {entry.goalId && (
              <View style={styles.goalTag}>
                <Target size={14} color="#4F46E5" />
                <Text style={styles.goalText}>
                  {goals.find(g => g.id === entry.goalId)?.title || 'Goal'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#ffffff" />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Journal Entry</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color="#111827" />
              </Pressable>
            </View>

            <TextInput
              style={styles.journalInput}
              placeholder="Write your thoughts..."
              value={newEntry}
              onChangeText={setNewEntry}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <View style={styles.goalSelector}>
              <Pressable
                style={[styles.selector, showGoalSelector && styles.selectorActive]}
                onPress={() => setShowGoalSelector(!showGoalSelector)}
              >
                <Text style={styles.selectorText}>
                  {selectedGoal 
                    ? goals.find(g => g.id === selectedGoal)?.title 
                    : 'Link to a goal (optional)'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </Pressable>

              {showGoalSelector && goals.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {goals.map((goal) => (
                      <Pressable
                        key={goal.id}
                        style={[
                          styles.dropdownItem,
                          selectedGoal === goal.id && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setSelectedGoal(goal.id);
                          setShowGoalSelector(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          selectedGoal === goal.id && styles.dropdownItemTextSelected
                        ]}>
                          {goal.title}
                        </Text>
                        <View style={[
                          styles.goalType,
                          goal.type === 'long-term' ? styles.longTerm : styles.shortTerm
                        ]}>
                          <Text style={styles.goalTypeText}>
                            {goal.type === 'short-term' ? 'Short-term' : 'Long-term'}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Pressable
              style={[
                styles.addEntryButton,
                !newEntry.trim() && styles.addEntryButtonDisabled
              ]}
              onPress={handleAddEntry}
              disabled={!newEntry.trim()}
            >
              <Text style={styles.addEntryButtonText}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
  },
  headerContent: {
    padding: 20,
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  entryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  goalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  goalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
  },
  journalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    height: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalSelector: {
    marginBottom: 16,
    zIndex: 1000,
  },
  selector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorActive: {
    borderColor: '#4F46E5',
    borderWidth: 2,
  },
  selectorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#4F46E5',
  },
  goalType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shortTerm: {
    backgroundColor: '#EEF2FF',
  },
  longTerm: {
    backgroundColor: '#F0FDF4',
  },
  goalTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
  },
  addEntryButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addEntryButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  addEntryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
}); 