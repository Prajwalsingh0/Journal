import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'pastel' | 'dark' | 'earthy' | 'dreamy';
export type AppView = 'landing' | 'feed' | 'write' | 'dashboard' | 'profile' | 'explore' | 'entry' | 'settings' | 'crisis';

export interface MoodOption {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
}

export interface TagOption {
  id: string;
  label: string;
  count?: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  displayName: string | null;
  pronouns: string;
  customPronoun: string | null;
  bio: string;
  avatarUrl: string | null;
  theme: ThemeName;
  interests: string[];
  isUnder18: boolean;
}

export interface JournalEntryData {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  mood: string;
  tags: string[];
  contentWarnings: string[];
  musicMood: string | null;
  fontStyle: string;
  visibility: 'public' | 'private' | 'friends';
  isAnonymous: boolean;
  isDraft: boolean;
  scheduledAt: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    displayName: string | null;
    pronouns: string;
    avatarUrl: string | null;
    isAnonymous: boolean;
  };
  reactions: { type: string; _count: number }[];
  commentCount: number;
}

export const MOODS: MoodOption[] = [
  { id: 'happy', label: 'Happy', icon: '😊', colorClass: 'mood-happy' },
  { id: 'calm', label: 'Calm', icon: '😌', colorClass: 'mood-calm' },
  { id: 'grateful', label: 'Grateful', icon: '🙏', colorClass: 'mood-grateful' },
  { id: 'excited', label: 'Excited', icon: '🤩', colorClass: 'mood-excited' },
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️', colorClass: 'mood-peaceful' },
  { id: 'loved', label: 'Loved', icon: '🥰', colorClass: 'mood-loved' },
  { id: 'hopeful', label: 'Hopeful', icon: '🌟', colorClass: 'mood-hopeful' },
  { id: 'creative', label: 'Creative', icon: '🎨', colorClass: 'mood-creative' },
  { id: 'nostalgic', label: 'Nostalgic', icon: '🌅', colorClass: 'mood-nostalgic' },
  { id: 'motivated', label: 'Motivated', icon: '💪', colorClass: 'mood-motivated' },
  { id: 'content', label: 'Content', icon: '🍃', colorClass: 'mood-content' },
  { id: 'proud', label: 'Proud', icon: '👑', colorClass: 'mood-proud' },
  { id: 'reflective', label: 'Reflective', icon: '🪞', colorClass: 'mood-reflective' },
  { id: 'neutral', label: 'Neutral', icon: '😐', colorClass: 'mood-neutral' },
  { id: 'anxious', label: 'Anxious', icon: '😰', colorClass: 'mood-anxious' },
  { id: 'sad', label: 'Sad', icon: '😢', colorClass: 'mood-sad' },
  { id: 'lonely', label: 'Lonely', icon: '🌙', colorClass: 'mood-lonely' },
  { id: 'tired', label: 'Tired', icon: '😴', colorClass: 'mood-tired' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: '🌀', colorClass: 'mood-overwhelmed' },
  { id: 'confused', label: 'Confused', icon: '🤔', colorClass: 'mood-confused' },
];

export const VIBE_TAGS: TagOption[] = [
  { id: 'journaling', label: '#journaling' },
  { id: 'mentalhealth', label: '#mentalhealth' },
  { id: 'schoollife', label: '#schoollife' },
  { id: 'selfcare', label: '#selfcare' },
  { id: 'relationships', label: '#relationships' },
  { id: 'gratitude', label: '#gratitude' },
  { id: 'growth', label: '#growth' },
  { id: 'creativity', label: '#creativity' },
  { id: 'wellness', label: '#wellness' },
  { id: 'identity', label: '#identity' },
  { id: 'dreams', label: '#dreams' },
  { id: 'reflection', label: '#reflection' },
  { id: 'selflove', label: '#selflove' },
  { id: 'healing', label: '#healing' },
  { id: 'mindfulness', label: '#mindfulness' },
];

export const CONTENT_WARNINGS = [
  'Anxiety',
  'Depression',
  'Self-harm',
  'Eating disorders',
  'Grief/Loss',
  'Abuse',
  'Bullying',
  'Substance use',
  'Suicidal thoughts',
  'Body image',
  'Relationship violence',
  'Discrimination',
];

export const TOPICS = [
  { id: 'mental-health', label: 'Mental Health & Wellness', icon: '🧠', color: 'bg-purple-100 text-purple-700' },
  { id: 'school-life', label: 'School & College Life', icon: '📚', color: 'bg-blue-100 text-blue-700' },
  { id: 'creative-writing', label: 'Creative Writing', icon: '✍️', color: 'bg-pink-100 text-pink-700' },
  { id: 'art', label: 'Art & Photography', icon: '🎨', color: 'bg-orange-100 text-orange-700' },
  { id: 'relationships', label: 'Relationships & Friendship', icon: '💕', color: 'bg-red-100 text-red-700' },
  { id: 'identity', label: 'Identity & Self-Discovery', icon: '🌈', color: 'bg-green-100 text-green-700' },
  { id: 'hobbies', label: 'Hobbies & Interests', icon: '🌟', color: 'bg-yellow-100 text-yellow-700' },
];

export const REACTION_TYPES = [
  { id: 'heart', icon: '💜', label: 'Heart' },
  { id: 'hug', icon: '🫂', label: 'Hug' },
  { id: 'inspiring', icon: '✨', label: 'Inspiring' },
  { id: 'relatable', icon: '🦋', label: 'Relatable' },
];

export const INTEREST_OPTIONS = [
  'Reading', 'Writing', 'Art', 'Music', 'Photography', 'Yoga', 'Meditation',
  'Cooking', 'Gaming', 'Fashion', 'Nature', 'Travel', 'Fitness', 'Film',
  'Dance', 'Crafts', 'Journaling', 'Self-care', 'Activism', 'Science',
];

interface AppState {
  // Auth
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;

  // Navigation
  currentView: AppView;
  selectedEntryId: string | null;
  selectedProfileId: string | null;

  // Theme
  theme: ThemeName;

  // Feed
  feedFilter: string;
  feedEntries: JournalEntryData[];

  // Writing
  draftTitle: string;
  draftContent: string;
  draftMood: string;
  draftTags: string[];
  draftWarnings: string[];
  draftVisibility: 'public' | 'private' | 'friends';
  draftIsAnonymous: boolean;
  draftFontStyle: string;
  draftMusicMood: string;

  // Modals
  showAuthModal: boolean;
  authModalMode: 'login' | 'signup';
  showComments: boolean;
  showReportModal: boolean;
  reportTargetEntryId: string | null;

  // Actions
  setTheme: (theme: ThemeName) => void;
  setCurrentView: (view: AppView) => void;
  setSelectedEntryId: (id: string | null) => void;
  setSelectedProfileId: (id: string | null) => void;
  login: (user: CurrentUser) => void;
  logout: () => void;
  updateProfile: (data: Partial<CurrentUser>) => void;
  setFeedFilter: (filter: string) => void;
  setFeedEntries: (entries: JournalEntryData[]) => void;
  setDraftField: <K extends keyof typeof import('./store').default extends () => infer S ? S : never>(key: string, value: any) => void;
  resetDraft: () => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  setShowComments: (show: boolean) => void;
  setShowReportModal: (show: boolean) => void;
  setReportTargetEntryId: (id: string | null) => void;
}

const initialDraft = {
  draftTitle: '',
  draftContent: '',
  draftMood: 'neutral',
  draftTags: [] as string[],
  draftWarnings: [] as string[],
  draftVisibility: 'public' as const,
  draftIsAnonymous: false,
  draftFontStyle: 'sans-serif',
  draftMusicMood: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,

      // Navigation
      currentView: 'landing',
      selectedEntryId: null,
      selectedProfileId: null,

      // Theme
      theme: 'pastel',

      // Feed
      feedFilter: 'all',
      feedEntries: [],

      // Writing
      ...initialDraft,

      // Modals
      showAuthModal: false,
      authModalMode: 'signup',
      showComments: false,
      showReportModal: false,
      reportTargetEntryId: null,

      // Actions
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme });
      },

      setCurrentView: (currentView) => set({ currentView }),
      setSelectedEntryId: (selectedEntryId) => set({ selectedEntryId }),
      setSelectedProfileId: (selectedProfileId) => set({ selectedProfileId }),

      login: (user) => set({ currentUser: user, isAuthenticated: true, currentView: 'feed' }),
      logout: () => set({ currentUser: null, isAuthenticated: false, currentView: 'landing' }),

      updateProfile: (data) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
      })),

      setFeedFilter: (feedFilter) => set({ feedFilter }),
      setFeedEntries: (feedEntries) => set({ feedEntries }),

      setDraftField: (key, value) => set({ [key]: value }),
      resetDraft: () => set(initialDraft),

      setShowAuthModal: (show) => set({ showAuthModal: show }),
      setAuthModalMode: (mode) => set({ authModalMode: mode }),
      setShowComments: (show) => set({ showComments: show }),
      setShowReportModal: (show) => set({ showReportModal: show }),
      setReportTargetEntryId: (id) => set({ reportTargetEntryId: id }),
    }),
    {
      name: 'bloom-storage',
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAppStore;