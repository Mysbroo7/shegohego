import axios from 'axios';

export interface EarningsReport {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  videoViews: number;
  videoLikes: number;
  videoShares: number;
  adRevenue: number;
  sponsoredRevenue: number;
  affiliateRevenue: number;
  giftRevenue: number;
  referralRevenue: number;
  subscriptionRevenue: number;
  totalRevenue: number;
  currency: string;
}

export interface UserAnalytics {
  userId: string;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  followers: number;
  following: number;
  avgEngagementRate: number;
  topVideos: string[];
  peakHours: number[];
  topCountries: string[];
}

export interface VideoAnalytics {
  videoId: string;
  userId: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  watchTime: number; // in seconds
  avgWatchDuration: number;
  completionRate: number;
  engagementRate: number;
  revenue: number;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalEarnings: number;
  monthlyEarnings: number;
  todayEarnings: number;
  totalViews: number;
  totalFollowers: number;
  engagementRate: number;
  growthRate: number;
  topPerformingVideo: VideoAnalytics | null;
}

export const analyticsService = {
  // Get earnings report
  async getEarningsReport(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate?: Date,
    endDate?: Date
  ): Promise<EarningsReport> {
    try {
      const response = await axios.get(`/api/analytics/earnings/${userId}`, {
        params: {
          period: period,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get earnings report error:', error);
      throw error;
    }
  },

  // Get user analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      const response = await axios.get(`/api/analytics/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user analytics error:', error);
      throw error;
    }
  },

  // Get video analytics
  async getVideoAnalytics(videoId: string): Promise<VideoAnalytics> {
    try {
      const response = await axios.get(`/api/analytics/video/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Get video analytics error:', error);
      throw error;
    }
  },

  // Get dashboard metrics
  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    try {
      const response = await axios.get(`/api/analytics/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get dashboard metrics error:', error);
      throw error;
    }
  },

  // Track video view
  async trackVideoView(videoId: string, userId: string, watchDuration: number): Promise<void> {
    try {
      await axios.post('/api/analytics/track-view', {
        videoId: videoId,
        userId: userId,
        watchDuration: watchDuration,
      });
    } catch (error) {
      console.error('Track video view error:', error);
    }
  },

  // Track engagement
  async trackEngagement(videoId: string, userId: string, type: 'like' | 'comment' | 'share'): Promise<void> {
    try {
      await axios.post('/api/analytics/track-engagement', {
        videoId: videoId,
        userId: userId,
        type: type,
      });
    } catch (error) {
      console.error('Track engagement error:', error);
    }
  },

  // Get top videos
  async getTopVideos(userId: string, limit: number = 10): Promise<VideoAnalytics[]> {
    try {
      const response = await axios.get(`/api/analytics/top-videos/${userId}`, {
        params: { limit: limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get top videos error:', error);
      return [];
    }
  },

  // Get growth chart data
  async getGrowthChartData(userId: string, days: number = 30): Promise<any[]> {
    try {
      const response = await axios.get(`/api/analytics/growth/${userId}`, {
        params: { days: days },
      });
      return response.data;
    } catch (error) {
      console.error('Get growth chart data error:', error);
      return [];
    }
  },

  // Get revenue chart data
  async getRevenueChartData(userId: string, days: number = 30): Promise<any[]> {
    try {
      const response = await axios.get(`/api/analytics/revenue-chart/${userId}`, {
        params: { days: days },
      });
      return response.data;
    } catch (error) {
      console.error('Get revenue chart data error:', error);
      return [];
    }
  },

  // Calculate engagement rate
  calculateEngagementRate(likes: number, comments: number, shares: number, views: number): number {
    if (views === 0) return 0;
    return ((likes + comments + shares) / views) * 100;
  },

  // Calculate completion rate
  calculateCompletionRate(avgWatchDuration: number, videoDuration: number): number {
    if (videoDuration === 0) return 0;
    return (avgWatchDuration / videoDuration) * 100;
  },

  // Estimate earnings
  estimateEarnings(
    views: number,
    likes: number,
    shares: number,
    adCPM: number = 2,
    engagementMultiplier: number = 1.5
  ): number {
    const adRevenue = (views / 1000) * adCPM;
    const engagementBonus = (likes + shares) * 0.01 * engagementMultiplier;
    return adRevenue + engagementBonus;
  },

  // Get earnings breakdown
  getEarningsBreakdown(report: EarningsReport): { [key: string]: number } {
    return {
      'Ad Revenue': report.adRevenue,
      'Sponsored Content': report.sponsoredRevenue,
      'Affiliate': report.affiliateRevenue,
      'Gifts': report.giftRevenue,
      'Referral': report.referralRevenue,
      'Subscription': report.subscriptionRevenue,
    };
  },
};
