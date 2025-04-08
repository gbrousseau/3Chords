import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Check, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../context/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '@/firebaseConfig';

export default function SubscriptionScreen() {
  const { userData } = useAuth();
  
  const handleSelectPlan = async (planType: string) => {
    if (userData) {
      try {
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userData.id);
        await updateDoc(userDocRef, {
          subscription: planType
        });
        router.replace('/assessment');
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to community forums',
        'Basic resources library',
        'Monthly newsletter'
      ],
      color: '#64748B',
      popular: false
    },
    {
      id: 'pay-per-service',
      name: 'Pay per Service',
      price: 'Varies',
      period: 'per session',
      features: [
        'Individual session booking',
        'Flexible scheduling',
        'No monthly commitment',
        'Access to all coaches'
      ],
      color: '#0EA5E9',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$39',
      period: 'monthly',
      features: [
        '2 coaching sessions/month',
        'Access to recorded workshops',
        'Email support',
        'Personal dashboard'
      ],
      color: '#4F46E5',
      popular: true
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$59',
      period: 'monthly',
      features: [
        '4 coaching sessions/month',
        'Priority scheduling',
        'Direct messaging with coach',
        'Personalized action plans'
      ],
      color: '#7C3AED',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$79',
      period: 'monthly',
      features: [
        'Unlimited coaching sessions',
        '24/7 priority support',
        'Personalized growth plan',
        'Exclusive resources access'
      ],
      color: '#1E40AF',
      popular: false
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <View>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Invest in your growth with our flexible plans</Text>
        </View>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <View 
            key={plan.id} 
            style={[
              styles.planCard,
              plan.popular && styles.popularPlan
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}
            
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>/{plan.period}</Text>
            </View>
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <Pressable 
              style={[styles.selectButton, { backgroundColor: plan.color }]}
              onPress={() => handleSelectPlan(plan.id)}
            >
              <Text style={styles.selectButtonText}>Select Plan</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Need a custom solution? Contact our team at support@3cords.com
        </Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  plansContainer: {
    padding: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  planName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#111827',
  },
  planPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});