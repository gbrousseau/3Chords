import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search as SearchIcon, Filter, Mail, X } from 'lucide-react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { useAuth } from '../../context/auth';
import { coachingServices } from '@/constants/coachingServices';
import { router } from 'expo-router';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic_url: string;
  services: string[];
  bio: string;
}

export default function SearchScreen() {
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [selectedServices]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(FIREBASE_FIRESTORE, 'users');
      let q = query(usersRef);

      if (selectedServices.length > 0) {
        q = query(usersRef, where('services', 'array-contains-any', selectedServices));
      }

      const querySnapshot = await getDocs(q);
      const fetchedUsers: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        if (doc.id !== userData?.id) { // Don't include current user
          fetchedUsers.push({ ...userData, id: doc.id });
        }
      });
      console.log(fetchedUsers)

      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower);
  });

  const handleContactUser = (email: string) => {
    const href = {
      pathname: "/(screens)/messages",
      params: { recipient: email }
    };
    router.push(href as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profile Search</Text>
          <Text style={styles.subtitle}>Find and connect with other members</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#4F46E5" : "#6B7280"} />
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter by Services</Text>
          <View style={styles.servicesGrid}>
            {coachingServices.map(service => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceChip,
                  selectedServices.includes(service.id) && styles.serviceChipSelected
                ]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={[
                  styles.serviceChipText,
                  selectedServices.includes(service.id) && styles.serviceChipTextSelected
                ]}>
                  {service.name}
                </Text>
                {selectedServices.includes(service.id) && (
                  <X size={16} color="#ffffff" />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No users found matching your criteria
              </Text>
            </View>
          ) : (
            filteredUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ 
                      uri: user.profilePic_url || 
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' 
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.userBio} numberOfLines={2}>
                      {user.bio || 'No bio available'}
                    </Text>
                    <View style={styles.userServices}>
                      {user.services?.slice(0, 2).map(serviceId => {
                        const service = coachingServices.find(s => s.id === serviceId);
                        return service ? (
                          <View key={serviceId} style={styles.serviceTag}>
                            <Text style={styles.serviceTagText}>
                              {service.name}
                            </Text>
                          </View>
                        ) : null;
                      })}
                      {(user.services?.length || 0) > 2 && (
                        <View style={styles.serviceTag}>
                          <Text style={styles.serviceTagText}>
                            +{user.services.length - 2} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Pressable
                  style={styles.contactButton}
                  onPress={() => handleContactUser(user.email)}
                >
                  <Mail size={20} color="#4F46E5" />
                  <Text style={styles.contactButtonText}>Contact</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    padding: 24,
    paddingTop: 64,
    paddingBottom: 32,
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
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    marginTop: -24,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#F9FAFB',
    zIndex: 1,
  },
  filterTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    marginBottom: 8,
  },
  serviceChipSelected: {
    backgroundColor: '#4F46E5',
  },
  serviceChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  serviceChipTextSelected: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  userBio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  userServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  serviceTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4F46E5',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4F46E5',
  },
}); 