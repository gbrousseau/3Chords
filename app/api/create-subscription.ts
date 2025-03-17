import { createSubscription } from './stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ message: 'Price ID is required' });
    }

    const result = await createSubscription(priceId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in create-subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}