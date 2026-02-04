// Integration Hub for Shego and Hego
// Combines all systems: Monetization, Gamification, Security, and Analytics

import AdvancedMonetizationSystem from './advanced-monetization';
import GamificationSystem from './gamification-system';
import SecurityPrivacySystem from './security-privacy';

interface AppUser {
  userId: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

class IntegrationHub {
  private monetization: AdvancedMonetizationSystem;
  private gamification: GamificationSystem;
  private security: SecurityPrivacySystem;
  private users: Map<string, AppUser> = new Map();

  constructor() {
    this.monetization = new AdvancedMonetizationSystem({
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      admobBannerId: process.env.ADMOB_BANNER_ID || '',
      admobRewardedId: process.env.ADMOB_REWARDED_ID || '',
      walletCurrency: 'USD',
    });

    this.gamification = new GamificationSystem();
    this.security = new SecurityPrivacySystem();
  }

  // 1. تسجيل مستخدم جديد
  async registerUser(email: string, phoneNumber: string): Promise<string> {
    try {
      const userId = `user_${Date.now()}`;

      const newUser: AppUser = {
        userId,
        email,
        phoneNumber,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      };

      this.users.set(userId, newUser);

      // إنشاء محفظة رقمية للمستخدم الجديد
      await this.monetization.createUserWallet(userId, 0);

      // إعداد إعدادات الخصوصية الافتراضية
      await this.security.createPrivacySettings(userId);

      // توليد مفاتيح التشفير
      this.security.generateEncryptionKeys(userId);

      // تسجيل حدث الأمان
      await this.security.logSecurityEvent(userId, 'user_registration', {
        email,
        timestamp: new Date(),
      });

      return userId;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // 2. تسجيل دخول المستخدم
  async loginUser(userId: string): Promise<boolean> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.lastLogin = new Date();

      // تسجيل حدث الأمان
      await this.security.logSecurityEvent(userId, 'user_login', {
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Error logging in user:', error);
      return false;
    }
  }

  // 3. مشاهدة فيديو وكسب النقاط
  async watchVideo(userId: string, videoId: string, duration: number): Promise<number> {
    try {
      let pointsEarned = 0;

      // الحصول على نقاط بناءً على مدة المشاهدة
      if (duration >= 6) {
        pointsEarned = 10; // نقاط كاملة لمشاهدة الفيديو بالكامل
      } else if (duration >= 3) {
        pointsEarned = 5; // نقاط جزئية
      }

      // إضافة النقاط إلى محفظة المستخدم
      await this.monetization.addToWallet(userId, pointsEarned, 'video_watch');

      // فحص إمكانية الحصول على أوسمة جديدة
      const newBadges = await this.gamification.checkAndAwardBadges(userId);

      if (newBadges.length > 0) {
        console.log(`User ${userId} earned new badges:`, newBadges);
      }

      return pointsEarned;
    } catch (error) {
      console.error('Error watching video:', error);
      return 0;
    }
  }

  // 4. التفاعل مع فيديو (إعجاب، تعليق، مشاركة)
  async interactWithVideo(
    userId: string,
    videoId: string,
    interactionType: 'like' | 'comment' | 'share'
  ): Promise<number> {
    try {
      let pointsEarned = 0;

      switch (interactionType) {
        case 'like':
          pointsEarned = 2;
          break;
        case 'comment':
          pointsEarned = 5;
          break;
        case 'share':
          pointsEarned = 10;
          break;
      }

      await this.monetization.addToWallet(userId, pointsEarned, `interaction_${interactionType}`);

      return pointsEarned;
    } catch (error) {
      console.error('Error interacting with video:', error);
      return 0;
    }
  }

  // 5. شراء هدية افتراضية وإرسالها
  async sendGift(senderId: string, receiverId: string, giftType: string): Promise<boolean> {
    try {
      const giftPrices: Record<string, number> = {
        rose: 10,
        heart: 20,
        diamond: 50,
        crown: 100,
        rocket: 200,
        plane: 500,
      };

      const price = giftPrices[giftType] || 10;

      // التحقق من رصيد المرسل
      const senderBalance = await this.monetization.getWalletBalance(senderId);
      if (senderBalance < price) {
        console.error('Insufficient balance');
        return false;
      }

      // إرسال الهدية
      await this.monetization.sendGift(senderId, receiverId, giftType, price);

      // تسجيل حدث الأمان
      await this.security.logSecurityEvent(senderId, 'gift_sent', {
        receiverId,
        giftType,
        amount: price,
      });

      return true;
    } catch (error) {
      console.error('Error sending gift:', error);
      return false;
    }
  }

  // 6. الاشتراك في خطة مدفوعة
  async subscribeToTier(userId: string, tier: 'silver' | 'gold' | 'diamond'): Promise<string> {
    try {
      const subscriptionId = await this.monetization.createSubscription(userId, tier);

      // تسجيل حدث الأمان
      await this.security.logSecurityEvent(userId, 'subscription_created', {
        tier,
        subscriptionId,
      });

      return subscriptionId;
    } catch (error) {
      console.error('Error subscribing to tier:', error);
      return '';
    }
  }

  // 7. الانضمام إلى تحدٍ أسبوعي
  async participateInChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      const joined = await this.gamification.joinChallenge(userId, challengeId);

      if (joined) {
        await this.security.logSecurityEvent(userId, 'challenge_joined', {
          challengeId,
        });
      }

      return joined;
    } catch (error) {
      console.error('Error participating in challenge:', error);
      return false;
    }
  }

  // 8. إكمال تحدٍ والحصول على المكافأة
  async completeChallengeAndReward(userId: string, challengeId: string): Promise<number> {
    try {
      const reward = await this.gamification.completeChallenge(userId, challengeId);

      if (reward > 0) {
        await this.security.logSecurityEvent(userId, 'challenge_completed', {
          challengeId,
          reward,
        });
      }

      return reward;
    } catch (error) {
      console.error('Error completing challenge:', error);
      return 0;
    }
  }

  // 9. سحب الأرباح
  async withdrawEarnings(userId: string, amount: number, bankDetails: any): Promise<boolean> {
    try {
      // فحص الأنشطة المريبة
      const isSuspicious = await this.security.detectSuspiciousActivity(userId, 'withdrawal');

      if (isSuspicious) {
        console.error('Suspicious activity detected');
        return false;
      }

      const success = await this.monetization.withdrawToBank(userId, amount, bankDetails);

      if (success) {
        await this.security.logSecurityEvent(userId, 'withdrawal_requested', {
          amount,
        });
      }

      return success;
    } catch (error) {
      console.error('Error withdrawing earnings:', error);
      return false;
    }
  }

  // 10. الحصول على لوحة المعلومات الشخصية
  async getUserDashboard(userId: string): Promise<any> {
    try {
      const user = this.users.get(userId);
      const walletBalance = await this.monetization.getWalletBalance(userId);
      const userProgress = await this.gamification.getUserProgress(userId);
      const leaderboardRank = (await this.gamification.getLeaderboard(1000)).findIndex(
        (entry) => entry.userId === userId
      );

      return {
        user,
        walletBalance,
        userProgress,
        leaderboardRank: leaderboardRank + 1,
        lastLogin: user?.lastLogin,
      };
    } catch (error) {
      console.error('Error getting user dashboard:', error);
      return null;
    }
  }

  // 11. حذف حساب المستخدم (GDPR)
  async deleteUserAccount(userId: string): Promise<boolean> {
    try {
      const deleted = await this.security.deleteUserData(userId);

      if (deleted) {
        this.users.delete(userId);
        await this.security.logSecurityEvent(userId, 'account_deleted', {
          timestamp: new Date(),
        });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting user account:', error);
      return false;
    }
  }

  // 12. تصدير بيانات المستخدم (GDPR)
  async exportUserData(userId: string): Promise<any> {
    try {
      const userData = await this.security.exportUserData(userId);

      await this.security.logSecurityEvent(userId, 'data_exported', {
        timestamp: new Date(),
      });

      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }
}

export default IntegrationHub;
