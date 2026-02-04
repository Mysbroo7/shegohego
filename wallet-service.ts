import axios from 'axios';

export interface WalletBalance {
  userId: string;
  coins: number;
  diamonds: number;
  cash: number;
  currency: string;
  lastUpdated: Date;
}

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  currency: string;
  bonus: number;
  discount: number;
  popular: boolean;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
  animation: string;
  category: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: 'ad_revenue' | 'gift_received' | 'gift_sent' | 'subscription' | 'coin_purchase' | 'withdrawal' | 'bonus';
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 100,
    price: 0.99,
    currency: 'USD',
    bonus: 0,
    discount: 0,
    popular: false,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 500,
    price: 4.99,
    currency: 'USD',
    bonus: 50,
    discount: 10,
    popular: true,
  },
  {
    id: 'mega',
    name: 'Mega Pack',
    coins: 1000,
    price: 9.99,
    currency: 'USD',
    bonus: 200,
    discount: 20,
    popular: false,
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    coins: 5000,
    price: 49.99,
    currency: 'USD',
    bonus: 1000,
    discount: 25,
    popular: false,
  },
];

export const GIFTS: Gift[] = [
  {
    id: 'rose',
    name: 'Rose',
    price: 1,
    icon: '🌹',
    animation: 'float',
    category: 'romantic',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 10,
    icon: '💎',
    animation: 'sparkle',
    category: 'premium',
  },
  {
    id: 'crown',
    name: 'Crown',
    price: 50,
    icon: '👑',
    animation: 'spin',
    category: 'premium',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    price: 100,
    icon: '🚀',
    animation: 'fly',
    category: 'premium',
  },
  {
    id: 'heart',
    name: 'Heart',
    price: 5,
    icon: '❤️',
    animation: 'pulse',
    category: 'romantic',
  },
  {
    id: 'star',
    name: 'Star',
    price: 20,
    icon: '⭐',
    animation: 'twinkle',
    category: 'premium',
  },
];

export const walletService = {
  // Get wallet balance
  async getWalletBalance(userId: string): Promise<WalletBalance> {
    try {
      const response = await axios.get(`/api/wallet/balance/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get wallet balance error:', error);
      throw error;
    }
  },

  // Purchase coins
  async purchaseCoins(userId: string, packageId: string, paymentMethod: string): Promise<WalletBalance> {
    try {
      const response = await axios.post('/api/wallet/purchase-coins', {
        userId: userId,
        packageId: packageId,
        paymentMethod: paymentMethod,
      });
      return response.data;
    } catch (error) {
      console.error('Purchase coins error:', error);
      throw error;
    }
  },

  // Send gift
  async sendGift(fromUserId: string, toUserId: string, giftId: string, quantity: number = 1): Promise<void> {
    try {
      await axios.post('/api/wallet/send-gift', {
        fromUserId: fromUserId,
        toUserId: toUserId,
        giftId: giftId,
        quantity: quantity,
      });
    } catch (error) {
      console.error('Send gift error:', error);
      throw error;
    }
  },

  // Convert coins to cash
  async convertCoinsToFiat(userId: string, coins: number): Promise<void> {
    try {
      await axios.post('/api/wallet/convert-coins', {
        userId: userId,
        coins: coins,
      });
    } catch (error) {
      console.error('Convert coins error:', error);
      throw error;
    }
  },

  // Withdraw cash
  async withdrawCash(userId: string, amount: number, bankAccount: any): Promise<void> {
    try {
      await axios.post('/api/wallet/withdraw', {
        userId: userId,
        amount: amount,
        bankAccount: bankAccount,
      });
    } catch (error) {
      console.error('Withdraw error:', error);
      throw error;
    }
  },

  // Get transaction history
  async getTransactionHistory(userId: string, limit: number = 50, offset: number = 0): Promise<WalletTransaction[]> {
    try {
      const response = await axios.get(`/api/wallet/transactions/${userId}`, {
        params: {
          limit: limit,
          offset: offset,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get transaction history error:', error);
      return [];
    }
  },

  // Add bonus coins
  async addBonusCoins(userId: string, coins: number, reason: string): Promise<void> {
    try {
      await axios.post('/api/wallet/add-bonus', {
        userId: userId,
        coins: coins,
        reason: reason,
      });
    } catch (error) {
      console.error('Add bonus error:', error);
      throw error;
    }
  },

  // Get coin packages
  getCoinPackages(): CoinPackage[] {
    return COIN_PACKAGES;
  },

  // Get gifts
  getGifts(): Gift[] {
    return GIFTS;
  },

  // Get gift by ID
  getGiftById(giftId: string): Gift | undefined {
    return GIFTS.find(gift => gift.id === giftId);
  },

  // Calculate total gift cost
  calculateGiftCost(giftId: string, quantity: number = 1): number {
    const gift = this.getGiftById(giftId);
    return gift ? gift.price * quantity : 0;
  },

  // Get coin package by ID
  getCoinPackageById(packageId: string): CoinPackage | undefined {
    return COIN_PACKAGES.find(pkg => pkg.id === packageId);
  },

  // Calculate total coins with bonus
  calculateTotalCoins(packageId: string): number {
    const pkg = this.getCoinPackageById(packageId);
    if (!pkg) return 0;
    return pkg.coins + pkg.bonus;
  },

  // Get discounted price
  getDiscountedPrice(packageId: string): number {
    const pkg = this.getCoinPackageById(packageId);
    if (!pkg) return 0;
    return pkg.price * (1 - pkg.discount / 100);
  },
};
