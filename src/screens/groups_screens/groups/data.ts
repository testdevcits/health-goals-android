export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  rank?: string;
  emoji: string;
  avatars: Array<string | { initial: string }>;
  private: boolean;
  joined?: boolean;
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
