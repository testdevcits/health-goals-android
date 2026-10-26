import {
  Settings,
  Watch,
  Gift,
  LockKeyhole,
  ChartNoAxesColumn,
  CircleHelp,
} from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';

type ProfileMenuItem = {
  id: string;
  title: string;
  emoji: string;
  icon: React.ReactNode;
};

const { theme } = useTheme();
const { colors } = theme;

export const menuItems: ProfileMenuItem[] = [
  {
    id: 'settings',
    title: 'Settings',
    emoji: '⚙️',
    icon: <Settings size={19} color={colors.textSecondary} />,
  },
  {
    id: 'devices',
    title: 'Connected Devices',
    emoji: '⌚',
    icon: <Watch size={19} color={colors.textSecondary} />,
  },
  {
    id: 'rewards',
    title: 'Rewards & Redemption',
    emoji: '🎁',
    icon: <Gift size={19} color={colors.textSecondary} />,
  },
  {
    id: 'privacy',
    title: 'Privacy & Permissions',
    emoji: '🔒',
    icon: <LockKeyhole size={19} color={colors.textSecondary} />,
  },
  {
    id: 'reports',
    title: 'Health Reports',
    emoji: '📊',
    icon: <ChartNoAxesColumn size={19} color={colors.textSecondary} />,
  },
  {
    id: 'support',
    title: 'Help & Support',
    emoji: '❓',
    icon: <CircleHelp size={19} color={colors.textSecondary} />,
  },
];
