export interface Reel {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  comments: number;
  shares: number;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tags: string[];
  createdAt: Date;
}

export const REELS_DATA: Reel[] = [
  {
    id: 'reel_01',
    title: 'Smart Farming 101',
    description: 'Water-Saving Techniques for Modern Agriculture',
    image: '/assets/reels/reel_01_agricultural.png',
    category: 'Agriculture',
    duration: 6,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    creator: {
      name: 'Shego and Hego',
      avatar: '/assets/logo.png',
      verified: true,
    },
    tags: ['farming', 'agriculture', 'water-saving', 'tips'],
    createdAt: new Date(),
  },
  {
    id: 'reel_02',
    title: 'Health Tip: Morning Yoga',
    description: '10 Minutes of Morning Yoga for Better Health',
    image: '/assets/reels/reel_02_health_yoga.png',
    category: 'Health',
    duration: 6,
    views: 0,
    likes: 0,