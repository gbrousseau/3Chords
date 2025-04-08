import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Platform } from 'react-native';
import { useAuth } from '../../context/auth';
import { Calendar, Clock, Plus, Target, ChevronDown, X, Edit2, Check, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { coachingServices } from '../../constants/coachingServices';
import { CoachingService } from '@/types/appTypes';
import { Goal } from '@/types/userTypes';

export default function GoalsScreen() {
  const { user, goals } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: new Date(),
    completed: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setSelectedService(goal.service);
    setGoalType(goal.type);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      deadline: new Date(goal.deadline),
      completed: goal.completed,
    });
    setEditModalVisible(true);
  };

  const handleUpdateGoal = async () => {
    if (!user?.uid || !editingGoal) return;

    const updatedGoals = goals.map(g => 
      g.id === editingGoal.id 
        ? {
            ...g,
            title: newGoal.title,
            description: newGoal.description,
            deadline: newGoal.deadline.toISOString(),
            service: selectedService,
            type: goalType,
            completed: newGoal.completed,
          }
        : g
    );

    try {
      const goalsRef = doc(FIREBASE_FIRESTORE, 'goals', user.uid);
      await setDoc(goalsRef, { goals: updatedGoals }, { merge: true });
      setEditModalVisible(false);
      setEditingGoal(null);
      resetForm();
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    }
  };

  const handleAddGoal = async () => {
    if (!user?.uid || !selectedService) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      service: selectedService,
      type: goalType,
      completed: false,
      deadline: newGoal.deadline.toISOString(),
    };

    const goalsRef = doc(FIREBASE_FIRESTORE, 'goals', user.uid);
    const updatedGoals = [...goals, goal];

    await setDoc(goalsRef, { goals: updatedGoals }, { merge: true });

    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setNewGoal({ 
      title: '', 
      description: '', 
      deadline: new Date(),
      completed: false,
    });
    setSelectedService('');
    setGoalType('short-term');
  };

  const toggleGoalCompletion = async (goalId: string) => {
    if (!user?.uid) return;

    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );

    const goalsRef = doc(FIREBASE_FIRESTORE, 'goals', user.uid);
    await setDoc(goalsRef, { goals: updatedGoals }, { merge: true });
  };

  const isGoalExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const renderGoalsByService = () => {
    return coachingServices.map((service: CoachingService) => {
      const serviceGoals = goals.filter(goal => 
        goal.service === service.id && 
        !goal.completed && 
        !isGoalExpired(goal.deadline)
      );

      if (serviceGoals.length) {
        return (
          <View key={service.id} style={styles.serviceSection}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {serviceGoals.map(goal => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalMainContent}>
                  <View style={styles.goalTitleRow}>
                    <ChevronRight 
                      size={20} 
                      color="#4B5563" 
                      style={[
                        styles.chevron,
                        expandedGoals.includes(goal.id) && styles.chevronExpanded
                      ]}
                    />
                    <Pressable 
                      style={styles.goalTitleContainer}
                      onPress={() => toggleGoalExpansion(goal.id)}
                    >
                      <Text style={styles.goalTitle} numberOfLines={1}>
                        {goal.title}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleEditGoal(goal)}
                    >
                      <Edit2 size={16} color="#4F46E5" />
                    </Pressable>
                  </View>
                  <View style={styles.goalStatusRow}>
                    <View style={[styles.goalType, goal.type === 'long-term' ? styles.longTerm : styles.shortTerm]}>
                      <Text style={styles.goalTypeText}>
                        {goal.type === 'short-term' ? 'Short-term' : 'Long-term'}
                      </Text>
                    </View>
                    <Pressable
                      style={[
                        styles.checkButton,
                        goal.completed && styles.checkButtonActive
                      ]}
                      onPress={() => toggleGoalCompletion(goal.id)}
                    >
                      <Check size={16} color={goal.completed ? "#ffffff" : "#4F46E5"} />
                    </Pressable>
                  </View>
                </View>

                {expandedGoals.includes(goal.id) && (
                  <View style={styles.goalContent}>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                    <View style={styles.goalFooter}>
                      <View style={styles.deadlineContainer}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.deadlineText}>
                          {new Date(goal.deadline).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        );
      }
      return null;
    });
  };

  const renderCompletedAndExpiredGoals = () => {
    const completedOrExpiredGoals = goals.filter(goal => 
      goal.completed || isGoalExpired(goal.deadline)
    );

    if (completedOrExpiredGoals.length === 0) return null;

    return (
      <View style={styles.serviceSection}>
        <Text style={styles.serviceName}>Completed & Past Goals</Text>
        {completedOrExpiredGoals.map(goal => (
          <View 
            key={goal.id} 
            style={[
              styles.goalCard,
              styles.completedGoalCard
            ]}
          >
            <View style={styles.goalMainContent}>
              <View style={styles.goalTitleRow}>
                <ChevronRight 
                  size={20} 
                  color="#6B7280" 
                  style={[
                    styles.chevron,
                    expandedGoals.includes(goal.id) && styles.chevronExpanded
                  ]}
                />
                <Pressable 
                  style={styles.goalTitleContainer}
                  onPress={() => toggleGoalExpansion(goal.id)}
                >
                  <Text style={[styles.goalTitle, styles.completedGoalTitle]} numberOfLines={1}>
                    {goal.title}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEditGoal(goal)}
                >
                  <Edit2 size={16} color="#6B7280" />
                </Pressable>
              </View>
              <View style={styles.goalStatusRow}>
                <View style={styles.goalStatus}>
                  <Text style={styles.goalStatusText}>
                    {goal.completed ? 'Completed' : 'Expired'}
                  </Text>
                </View>
              </View>
            </View>

            {expandedGoals.includes(goal.id) && (
              <View style={styles.goalContent}>
                <Text style={[styles.goalDescription, styles.completedGoalText]}>
                  {goal.description}
                </Text>
                <View style={styles.goalFooter}>
                  <View style={styles.deadlineContainer}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.deadlineText}>
                      {new Date(goal.deadline).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={newGoal.deadline.toISOString().split('T')[0]}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setNewGoal({ ...newGoal, deadline: date });
          }}
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: 'Inter-Regular',
            fontSize: '16px',
            color: '#111827',
            border: '1px solid #E5E7EB',
            width: '100%',
            marginBottom: '16px',
            outline: 'none',
          }}
        />
      );
    }

    return (
      <>
        <Pressable
          style={styles.selector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectorText}>
            {newGoal.deadline.toLocaleDateString()}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={newGoal.deadline}
            mode="date"
            onChange={(_event: any, date?: Date) => {
              setShowDatePicker(false);
              if (date) {
                setNewGoal({ ...newGoal, deadline: date });
              }
            }}
          />
        )}
      </>
    );
  };

  const renderModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? editModalVisible : modalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Goal' : 'New Goal'}
            </Text>
            <Pressable 
              onPress={() => {
                if (isEdit) {
                  setEditModalVisible(false);
                  setEditingGoal(null);
                } else {
                  setModalVisible(false);
                }
                resetForm();
              }}
            >
              <X size={24} color="#111827" />
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Goal Title"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={newGoal.description}
            onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
            multiline
            numberOfLines={4}
          />

          {renderDatePicker()}

          {isEdit && (
            <Pressable
              style={styles.completionToggle}
              onPress={() => setNewGoal({ ...newGoal, completed: !newGoal.completed })}
            >
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Mark as Completed</Text>
                <View style={[
                  styles.toggleSwitch,
                  newGoal.completed && styles.toggleSwitchActive
                ]}>
                  <View style={[
                    styles.toggleHandle,
                    newGoal.completed && styles.toggleHandleActive
                  ]} />
                </View>
              </View>
            </Pressable>
          )}

          <View style={styles.serviceSelector}>
            <Pressable
              style={[styles.selector, showServiceDropdown && styles.selectorActive]}
              onPress={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              <Text style={styles.selectorText}>
                {selectedService ? coachingServices.find(s => s.id === selectedService)?.name : 'Select Service'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </Pressable>

            {showServiceDropdown && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {coachingServices.map((service: CoachingService) => (
                    <Pressable
                      key={service.id}
                      style={[
                        styles.dropdownItem,
                        selectedService === service.id && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setSelectedService(service.id);
                        setShowServiceDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedService === service.id && styles.dropdownItemTextSelected
                      ]}>
                        {service.name}
                      </Text>
                      <Text style={styles.dropdownItemDescription}>
                        {service.description}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.typeSelector}>
            <Pressable
              style={[
                styles.typeOption,
                goalType === 'short-term' && styles.typeOptionSelected
              ]}
              onPress={() => setGoalType('short-term')}
            >
              <Clock size={20} color={goalType === 'short-term' ? '#ffffff' : '#6B7280'} />
              <Text style={[
                styles.typeOptionText,
                goalType === 'short-term' && styles.typeOptionTextSelected
              ]}>
                Short-term
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeOption,
                goalType === 'long-term' && styles.typeOptionSelected
              ]}
              onPress={() => setGoalType('long-term')}
            >
              <Target size={20} color={goalType === 'long-term' ? '#ffffff' : '#6B7280'} />
              <Text style={[
                styles.typeOptionText,
                goalType === 'long-term' && styles.typeOptionTextSelected
              ]}>
                Long-term
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.addGoalButton}
            onPress={isEdit ? handleUpdateGoal : handleAddGoal}
          >
            <Text style={styles.addGoalButtonText}>
              {isEdit ? 'Update Goal' : 'Add Goal'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Goal Tracker</Text>
          <Text style={styles.subtitle}>Track and achieve your personal and professional goals</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {renderGoalsByService()}
        {renderCompletedAndExpiredGoals()}
      </ScrollView>

      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#ffffff" />
      </Pressable>

      {renderModal(false)}
      {renderModal(true)}
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
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCardCompleted: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6',
  },
  goalMainContent: {
    gap: 12,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28, // To align with title after chevron
  },
  goalTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  editButton: {
    padding: 8,
  },
  chevron: {
    marginRight: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  checkButton: {
    padding: 8,
  },
  checkButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  goalContent: {
    marginTop: 12,
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 22,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deadlineText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
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
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  selector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  serviceSelector: {
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: -12,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownList: {
    maxHeight: 240,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  dropdownItemTextSelected: {
    color: '#4F46E5',
  },
  dropdownItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  typeOptionSelected: {
    backgroundColor: '#4F46E5',
  },
  typeOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
  },
  typeOptionTextSelected: {
    color: '#ffffff',
  },
  addGoalButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addGoalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  completedGoalCard: {
    backgroundColor: '#F3F4F6',
  },
  completedGoalTitle: {
    color: '#4B5563',
  },
  completedGoalText: {
    color: '#6B7280',
  },
  goalStatus: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  goalStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  goalType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
    letterSpacing: 0.5,
  },
  completionToggle: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#111827',
  },
  toggleSwitch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#4F46E5',
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleHandleActive: {
    transform: [{ translateX: 24 }],
  },
}); 