import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    features: ['Access to community forums', 'Basic resources library', 'Monthly newsletter'],
  },
  {
    id: 'pay-per-service',
    name: 'Pay per Service',
    price: 'Varies',
    features: ['Individual session booking', 'Flexible scheduling', 'No monthly commitment'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '39',
    features: ['2 coaching sessions/month', 'Access to recorded workshops', 'Email support'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '59',
    features: ['4 coaching sessions/month', 'Priority scheduling', 'Direct messaging with coach'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '79',
    features: ['Unlimited coaching sessions', '24/7 priority support', 'Personalized growth plan'],
  },
];

export default function SubscriptionScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#1F2937" size={24} />
          </Pressable>
          <View>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Invest in your growth with our flexible plans</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1000&fit=crop' }}
          style={styles.infoImage}
        />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Flexible Plans for Your Journey</Text>
          <View style={styles.infoBenefits}>
            <View style={styles.benefitRow}>
              <Check size={20} color="#4F46E5" />
              <Text style={styles.benefitText}>No contracts - Cancel anytime</Text>
            </View>
            <View style={styles.benefitRow}>
              <Check size={20} color="#4F46E5" />
              <Text style={styles.benefitText}>Student discount: $5/month off</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                ${plan.price}
                {plan.price !== 'Varies' && <Text style={styles.perMonth}>/month</Text>}
              </Text>
            </View>
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Check size={16} color="#4F46E5" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <Pressable
              style={styles.subscribeButton}
              onPress={() => router.push('/(auth)/assessment')}
            >
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </Pressable>
          </View>
        ))}
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoImage: {
    width: '100%',
    height: 160,
  },
  infoContent: {
    padding: 20,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  infoBenefits: {
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
  },
  plansContainer: {
    padding: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#4F46E5',
  },
  perMonth: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
  },
  subscribeButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});