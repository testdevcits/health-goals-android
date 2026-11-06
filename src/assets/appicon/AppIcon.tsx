import React from 'react';
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Search,
  Menu,
  Home,
  User,
  Settings,
  Bell,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash2,
  Camera,
  Image,
  Upload,
  Download,
  Share2,
  MoreVertical,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  LogOut,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  CircleHelp,
  type LucideIcon,
  Inbox,
  CircleAlert,
  Trophy,
  House,
  UsersRound,
  Compass,
  UserRound,
  HeartPulse,
  MailCheck,
  Footprints,
  Pause,
  Play,
  LockKeyhole,
  Send,
  Dumbbell,
} from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export const ICONS = {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Search,
  Menu,
  Home,
  User,
  Settings,
  Bell,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash2,
  Camera,
  Image,
  Upload,
  Download,
  Share2,
  MoreVertical,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  LogOut,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  CircleHelp,
  Inbox,
  CircleAlert,
  Trophy,
  House,
  UsersRound,
  Compass,
  UserRound,
  HeartPulse,
  MailCheck,
  Footprints,
  Pause,
  Play,
  LockKeyhole,
  Send,
  Dumbbell,
} as const;

export type IconName = keyof typeof ICONS;

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: object;
  fill?: string;
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 22,
  color,
  strokeWidth = 2,
  style,
  fill,
}) => {
  const { theme } = useTheme();

  const IconComponent: LucideIcon = ICONS[name];
  const themeColor =
    color && Object.prototype.hasOwnProperty.call(theme.colors, color)
      ? theme.colors[color as keyof typeof theme.colors]
      : undefined;

  return (
    <IconComponent
      size={size}
      color={themeColor ?? color ?? theme.colors.textPrimary}
      strokeWidth={strokeWidth}
      style={style}
      fill={fill ?? 'none'}
    />
  );
};

export default AppIcon;
