import functions from '@react-native-firebase/functions';

export async function createSubscription(priceId: string) {
  const createSubscriptionCallable = functions().httpsCallable('createSubscription');
  const response = await createSubscriptionCallable({ priceId });
  return response.data;
}

export default {
  createSubscription,
};