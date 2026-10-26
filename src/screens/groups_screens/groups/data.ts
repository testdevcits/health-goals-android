
export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  rank?: string;
  emoji: string;
  avatars: string[];
  private: boolean;
}

export interface FeedPost {
  id: string;
  name: string;
  initials: string;
  group: string;
  time: string;
  message: string;
  emoji: string;
  color: string;
  kudos: number;
  comments: number;
}



export const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Morning Runners',
    description: 'Weekly step challenge',
    members: 8,
    emoji: '🏃',
    avatars: ['S', 'M', 'A', 'P'],
    private: false,
  },
  {
    id: '2',
    name: 'Office Warriors',
    description: 'Company team',
    members: 24,
    rank: '#3 on company board',
    emoji: '💼',
    avatars: ['K', 'D', 'A', 'L'],
    private: false,
  },
  {
    id: '3',
    name: 'Yoga Squad',
    description: 'Accountability pod',
    members: 5,
    emoji: '🧘',
    avatars: ['P', 'A', 'R', 'T'],
    private: true,
  },
];

export const initialPosts: FeedPost[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    initials: 'S',
    group: 'Morning Runners',
    time: '32 min ago',
    message:
      "Just crushed a 12,450-step day and took the #1 spot! Who's catching me? 😎",
    emoji: '🏃',
    color: '#FF8278',
    kudos: 24,
    comments: 6,
  },
  {
    id: '2',
    name: 'Mike Chen',
    initials: 'M',
    group: 'Office Warriors',
    time: '1h ago',
    message:
      "Completed the 30-Day Step Sprint week 2! Our team is now #3. Let's go! 🔥",
    emoji: '💪',
    color: '#579CF4',
    kudos: 18,
    comments: 4,
  },
  {
    id: '3',
    name: 'Priya Patel',
    initials: 'P',
    group: 'Yoga Squad',
    time: '2h ago',
    message:
      'Day 5 of the Morning Yoga Streak done ✅. My back feels amazing. Anyone want to join tomorrow at 7 AM?',
    emoji: '🧘',
    color: '#8175F5',
    kudos: 31,
    comments: 9,
  },
];