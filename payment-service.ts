import axios from 'axios';

// Payment Gateway Configurations
export interface PaymentConfig {
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalSecret: string;
  twoCheckoutKey: string;
  googlePlayKey: string;
  appStoreKey: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'coins' | 'gift' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  timestamp: Date;
  description: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly';
  features: string[];
  storageLimit: number; // in GB
  adFree: boolean;
  prioritySupport: boolean;
  earningsMultiplier: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    duration: 'monthly',
    features: ['Basic features', '5GB storage'],
    storageLimit: 5,
    adFree: false,
    prioritySupport: false,
    earningsMultiplier: 1,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    currency: 'USD',
    duration: 'monthly',
    features: ['Ad-free', '50GB storage', 'Advanced analytics', 'Custom branding'],
    storageLimit: 50,
    adFree: true,
    prioritySupport: true,
    earningsMultiplier: 1.5,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    duration: 'monthly',
    features: ['Everything in Pro', '200GB storage', 'Priority support', 'Early access to features'],
    storageLimit: 200,
    adFree: true,
    prioritySupport: true,
    earningsMultiplier: 2,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19.99,
    currency: 'USD',
    duration: 'monthly',
    features: ['Everything in Premium', 'Unlimited storage', 'Creator tools', 'Revenue sharing'],
    storageLimit: 500,
    adFree: true,
    prioritySupport: true,
    earningsMultiplier: 3,
  },
];

export const paymentService = {
  // Initialize payment gateways
  async initializePaymentGateways(config: PaymentConfig): Promise<void> {
    try {
      // Stripe initialization
      // await Stripe.setPublishableKey(config.stripePublicKey);
      
      // PayPal initialization
      // await PayPal.initialize(config.paypalClientId);
      
      console.log('Payment gateways initialized');
    } catch (error) {
      console.error('Payment gateway initialization error:', error);
    }
  },

  // Process payment with Stripe
  async processStripePayment(
    amount: number,
    currency: string,
    token: string,
    description: string
  ): Promise<Transaction> {
    try {
      const response = await axios.post('/api/payments/stripe', {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        source: token,
        description: description,
      });

      return {
        id: response.data.id,
        userId: response.data.userId,
        amount: amount,
        currency: currency,
        type: 'subscription',
        status: 'completed',
        paymentMethod: {
          id: token,
          type: 'credit_card',
          isDefault: false,
        },
        timestamp: new Date(),
        description: description,
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    }
  },

  // Process payment with PayPal
  async processPayPalPayment(
    amount: number,
    currency: string,
    description: string
  ): Promise<Transaction> {
    try {
      const response = await axios.post('/api/payments/paypal', {
        amount: amount,
        currency: currency,
        description: description,
      });

      return {
        id: response.data.id,
        userId: response.data.userId,
        amount: amount,
        currency: currency,
        type: 'subscription',
        status: 'completed',
        paymentMethod: {
          id: response.data.payerId,
          type: 'paypal',
          isDefault: false,
        },
        timestamp: new Date(),
        description: description,
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  },

  // Process in-app purchase (Apple Pay / Google Pay)
  async processInAppPurchase(
    productId: string,
    platform: 'ios' | 'android'
  ): Promise<Transaction> {
    try {
      const response = await axios.post('/api/payments/in-app', {
        productId: productId,
        platform: platform,
      });

      return {
        id: response.data.transactionId,
        userId: response.data.userId,
        amount: response.data.amount,
        currency: response.data.currency,
        type: 'subscription',
        status: 'completed',
        paymentMethod: {
          id: response.data.paymentMethodId,
          type: platform === 'ios' ? 'apple_pay' : 'google_pay',
          isDefault: false,
        },
        timestamp: new Date(),
        description: response.data.description,
      };
    } catch (error) {
      console.error('In-app purchase error:', error);
      throw error;
    }
  },

  // Add coins to wallet
  async addCoins(userId: string, amount: number, reason: string): Promise<void> {
    try {
      await axios.post('/api/wallet/add-coins', {
        userId: userId,
        amount: amount,
        reason: reason,
      });
    } catch (error) {
      console.error('Add coins error:', error);
      throw error;
    }
  },

  // Send gift
  async sendGift(fromUserId: string, toUserId: string, giftId: string, amount: number): Promise<void> {
    try {
      await axios.post('/api/gifts/send', {
        fromUserId: fromUserId,
        toUserId: toUserId,
        giftId: giftId,
        amount: amount,
      });
    } catch (error) {
      console.error('Send gift error:', error);
      throw error;
    }
  },

  // Withdraw earnings
  async withdrawEarnings(userId: string, amount: number, bankAccount: any): Promise<void> {
    try {
      await axios.post('/api/earnings/withdraw', {
        userId: userId,
        amount: amount,
        bankAccount: bankAccount,
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      throw error;
    }
  },

  // Get subscription plan
  getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  },

  // Get all subscription plans
  getAllSubscriptionPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  },

  // Calculate earnings
  calculateEarnings(
    views: number,
    likes: number,
    shares: number,
    multiplier: number = 1
  ): number {
    const baseEarnings = (views * 0.001) + (likes * 0.01) + (shares * 0.05);
    return baseEarnings * multiplier;
  },
};
