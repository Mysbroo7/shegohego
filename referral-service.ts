import axios from 'axios';

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referredUserId: string;
  rewardType: 'coins' | 'cash' | 'discount';
  amount: number;
  status: 'pending' | 'completed';
  createdAt: Date;
}

export interface ReferralStats {
  userId: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  currency: string;
  pendingRewards: number;
  completedRewards: number;
}

export const REFERRAL_REWARDS = {
  referrer: {
    coins: 500,
    cash: 5,
  },
  referred: {
    coins: 250,
    cash: 2.5,
  },
  subscription: {
    commissionRate: 0.1, // 10% commission
  },
};

export const referralService = {
  // Generate referral code
  async generateReferralCode(userId: string, commissionRate: number = 0.1): Promise<ReferralCode> {
    try {
      const response = await axios.post('/api/referral/generate-code', {
        userId: userId,
        commissionRate: commissionRate,
      });
      return response.data;
    } catch (error) {
      console.error('Generate referral code error:', error);
      throw error;
    }
  },

  // Get referral code
  async getReferralCode(userId: string): Promise<ReferralCode | null> {
    try {
      const response = await axios.get(`/api/referral/code/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get referral code error:', error);
      return null;
    }
  },

  // Use referral code
  async useReferralCode(referralCode: string, newUserId: string): Promise<void> {
    try {
      await axios.post('/api/referral/use-code', {
        referralCode: referralCode,
        newUserId: newUserId,
      });
    } catch (error) {
      console.error('Use referral code error:', error);
      throw error;
    }
  },

  // Get referral stats
  async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const response = await axios.get(`/api/referral/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get referral stats error:', error);
      throw error;
    }
  },

  // Get referral rewards
  async getReferralRewards(userId: string, limit: number = 50): Promise<ReferralReward[]> {
    try {
      const response = await axios.get(`/api/referral/rewards/${userId}`, {
        params: { limit: limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get referral rewards error:', error);
      return [];
    }
  },

  // Claim referral reward
  async claimReferralReward(rewardId: string): Promise<void> {
    try {
      await axios.post(`/api/referral/claim-reward/${rewardId}`);
    } catch (error) {
      console.error('Claim referral reward error:', error);
      throw error;
    }
  },

  // Get referral list
  async getReferralList(userId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      const response = await axios.get(`/api/referral/list/${userId}`, {
        params: {
          limit: limit,
          offset: offset,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get referral list error:', error);
      return [];
    }
  },

  // Share referral link
  async shareReferralLink(userId: string, platform: string): Promise<string> {
    try {
      const referralCode = await this.getReferralCode(userId);
      if (!referralCode) {
        throw new Error('No referral code found');
      }

      const referralLink = `https://shegoandhego.com/ref/${referralCode.code}`;
      const message = `Join me on Shego and Hego! Use my referral code: ${referralCode.code}`;

      // Share on different platforms
      if (platform === 'whatsapp') {
        return `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`;
      } else if (platform === 'telegram') {
        return `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
      } else if (platform === 'facebook') {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
      } else if (platform === 'twitter') {
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
      }

      return referralLink;
    } catch (error) {
      console.error('Share referral link error:', error);
      throw error;
    }
  },

  // Calculate referral earnings
  calculateReferralEarnings(
    referralsCount: number,
    subscriptionEarnings: number = 0,
    commissionRate: number = REFERRAL_REWARDS.subscription.commissionRate
  ): number {
    const signupBonus = referralsCount * REFERRAL_REWARDS.referrer.cash;
    const subscriptionCommission = subscriptionEarnings * commissionRate;
    return signupBonus + subscriptionCommission;
  },

  // Get referral rewards info
  getReferralRewardsInfo() {
    return REFERRAL_REWARDS;
  },
};
