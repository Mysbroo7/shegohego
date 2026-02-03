// Gamification System for Shego and Hego
// Challenges, Badges, and Interactive Features

import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // بالأيام
  reward: number; // نقاط
  participantCount: number;
}

interface UserProgress {
  userId: string;
  badges: Badge[];
  challengesCompleted: number;
  totalPoints: number;
  level: number;
}

class GamificationSystem {
  private db: any;
  private badges: Map<string, Badge> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();

  constructor() {
    this.initializeFirebase();
    this.initializeBadges();
  }

  private initializeFirebase() {
    this.db = getFirestore();
  }

  private initializeBadges() {
    // تعريف الأوسمة المختلفة
    const badgesList: Badge[] = [
      {
        id: 'first_video',
        name: 'البداية الأولى',
        description: 'شاهد أول فيديو تعليمي',
        icon: '🎬',
        requirement: 1,
      },
      {
        id: 'learning_master',
        name: 'معلم التعلم',
        description: 'شاهد 100 فيديو تعليمي',
        icon: '🎓',
        requirement: 100,
      },
      {
        id: 'agriculture_expert',
        name: 'خبير الزراعة',
        description: 'شاهد 50 فيديو عن الزراعة',
        icon: '🌱',
        requirement: 50,
      },
      {
        id: 'health_guru',
        name: 'معلم الصحة',
        description: 'شاهد 50 فيديو عن الصحة والطب',
        icon: '⚕️',
        requirement: 50,
      },
      {
        id: 'science_enthusiast',
        name: 'عاشق العلوم',
        description: 'شاهد 50 فيديو علمي',
        icon: '🔬',
        requirement: 50,
      },
      {
        id: 'social_butterfly',
        name: 'الفراشة الاجتماعية',
        description: 'تفاعل مع 100 فيديو (إعجاب أو تعليق)',
        icon: '🦋',
        requirement: 100,
      },
      {
        id: 'generous_gifter',
        name: 'المانح الكريم',
        description: 'أرسل 10 هدايا افتراضية',
        icon: '🎁',
        requirement: 10,
      },
      {
        id: 'influencer',
        name: 'المؤثر',
        description: 'احصل على 1000 متابع',
        icon: '⭐',
        requirement: 1000,
      },
    ];

    badgesList.forEach((badge) => {
      this.badges.set(badge.id, badge);
    });
  }

  // 1. نظام التحديات الأسبوعية
  async createWeeklyChallenge(title: string, description: string, reward: number): Promise<string> {
    try {
      const challenge: Challenge = {
        id: `challenge_${Date.now()}`,
        title,
        description,
        duration: 7, // أسبوع واحد
        reward,
        participantCount: 0,
      };

      const docRef = await addDoc(collection(this.db, 'challenges'), challenge);
      return docRef.id;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return '';
    }
  }

  // 2. الانضمام إلى تحدٍ
  async joinChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      await addDoc(collection(this.db, 'challenge_participants'), {
        userId,
        challengeId,
        joinedAt: new Date(),
        completed: false,
      });
      return true;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  // 3. إكمال تحدٍ والحصول على المكافأة
  async completeChallenge(userId: string, challengeId: string): Promise<number> {
    try {
      const challenge = await this.getChallengeData(challengeId);
      if (!challenge) return 0;

      // تحديث حالة المستخدم
      const userProgress = this.userProgress.get(userId) || {
        userId,
        badges: [],
        challengesCompleted: 0,
        totalPoints: 0,
        level: 1,
      };

      userProgress.challengesCompleted += 1;
      userProgress.totalPoints += challenge.reward;
      userProgress.level = Math.floor(userProgress.totalPoints / 500) + 1;

      this.userProgress.set(userId, userProgress);

      // حفظ في قاعدة البيانات
      await addDoc(collection(this.db, 'challenge_completions'), {
        userId,
        challengeId,
        reward: challenge.reward,
        completedAt: new Date(),
      });

      return challenge.reward;
    } catch (error) {
      console.error('Error completing challenge:', error);
      return 0;
    }
  }

  // 4. نظام الأوسمة (Badges)
  async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    try {
      const userProgress = this.userProgress.get(userId);
      if (!userProgress) return [];

      const newBadges: Badge[] = [];

      // فحص كل وسام
      this.badges.forEach((badge) => {
        const alreadyHas = userProgress.badges.some((b) => b.id === badge.id);
        if (!alreadyHas && userProgress.totalPoints >= badge.requirement) {
          newBadges.push(badge);
          userProgress.badges.push(badge);
        }
      });

      // حفظ الأوسمة الجديدة
      if (newBadges.length > 0) {
        await addDoc(collection(this.db, 'user_badges'), {
          userId,
          badges: newBadges,
          awardedAt: new Date(),
        });
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  // 5. التعليقات الصوتية السريعة
  async recordVoiceComment(userId: string, videoId: string, audioUrl: string): Promise<boolean> {
    try {
      await addDoc(collection(this.db, 'voice_comments'), {
        userId,
        videoId,
        audioUrl,
        createdAt: new Date(),
        likes: 0,
      });

      // إضافة نقاط للمستخدم
      const userProgress = this.userProgress.get(userId);
      if (userProgress) {
        userProgress.totalPoints += 10;
      }

      return true;
    } catch (error) {
      console.error('Error recording voice comment:', error);
      return false;
    }
  }

  // 6. نظام الترتيب (Leaderboard)
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const leaderboard: any[] = [];

      // ترتيب المستخدمين حسب النقاط
      const sortedUsers = Array.from(this.userProgress.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints
      );

      sortedUsers.slice(0, limit).forEach((user, index) => {
        leaderboard.push({
          rank: index + 1,
          userId: user.userId,
          totalPoints: user.totalPoints,
          level: user.level,
          badgesCount: user.badges.length,
        });
      });

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // 7. الحصول على بيانات التقدم
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      return this.userProgress.get(userId) || null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  // 8. مساعد خاص: الحصول على بيانات التحدي
  private async getChallengeData(challengeId: string): Promise<Challenge | null> {
    try {
      // هذا مثال - في الواقع ستحصل على البيانات من Firestore
      return null;
    } catch (error) {
      console.error('Error getting challenge data:', error);
      return null;
    }
  }
}

export default GamificationSystem;
