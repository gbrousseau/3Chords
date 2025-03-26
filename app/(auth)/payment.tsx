import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStripe } from '@stripe/stripe-react-native';
import { Check } from 'lucide-react-native';
import { createSubscription } from '../api/stripe';

const subscriptionPlans = [
  {
    id: 'price_monthly',
    name: 'Monthly Plan',
    price: '$29.99',
    period: 'month',
    features: [
      'Access to all coaching rooms',
      'Weekly accountability sessions',
      'Basic video library',
      'Community access',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'price_yearly',
    name: 'Annual Plan',
    price: '$299.99',
    period: 'year',
    features: [
      'Everything in Monthly Plan',
      '2 months free',
      'Priority support',
      'Exclusive workshops',
      'Advanced video library',
      'Personal goal tracking'
    ],
    popular: true
  }
];

export default function PaymentScreen() {
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1]);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Create subscription on your backend
      const { clientSecret } = await createSubscription(selectedPlan.id);
      
      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: '3 Chords Coaching',
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Error', paymentError.message);
        return;
      }

      // Payment successful
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Select the plan that best fits your needs</Text>

        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan.id === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>per {plan.period}</Text>
              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#4F46E5" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : `Subscribe to ${selectedPlan.name}`}
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 60,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 32,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  selectedPlan: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  popularPlan: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  planName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 4,
  },
  planPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4F46E5',
  },
}); 