export const STORAGE_KEYS = {
  USER_PROFILE: 'AQUAPULSE_USER_PROFILE',
  WATER_LOG: 'AQUAPULSE_WATER_LOG',
  REMINDERS: 'AQUAPULSE_REMINDERS',
  WATER_REMINDERS: 'AQUAPULSE_WATER_REMINDERS',
  NOTES: 'AQUAPULSE_NOTES',
  SETTINGS: 'AQUAPULSE_SETTINGS',
};

export const DEFAULT_PROFILE = {
  version: 1,
  name: '',
  weight: 70,
  height: 170,
  age: 25,
  activityLevel: 'moderate',
  dailyWaterGoal: 2310,
  onboardingComplete: false,
};

export const DEFAULT_SETTINGS = {
  version: 1,
  theme: 'system',
  soundEnabled: true,
  notificationsEnabled: true,
  soundVolume: 0.7,
};

export const DEFAULT_WATER_REMINDERS = {
  version: 1,
  enabled: false,
  intervalMinutes: 60,
  activeHoursStart: '08:00',
  activeHoursEnd: '22:00',
  sound: 'water-drop',
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.0,
  moderate: 1.2,
  active: 1.4,
};

export const WATER_QUICK_ADD = [100, 250, 500];

export const SOUNDS = {
  'water-drop': { label: 'Water Drop', file: '/sounds/water-drop.mp3' },
  'gentle-bell': { label: 'Gentle Bell', file: '/sounds/gentle-bell.mp3' },
  'success-chime': { label: 'Success Chime', file: '/sounds/success-chime.mp3' },
};

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: 'text-warning' },
  { max: 25, label: 'Normal', color: 'text-success' },
  { max: 30, label: 'Overweight', color: 'text-warning' },
  { max: Infinity, label: 'Obese', color: 'text-destructive' },
];
