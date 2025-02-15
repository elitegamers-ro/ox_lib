import { ToastPosition } from 'react-hot-toast';
import { IconifyIcon } from '@iconify/react';
import { Sx } from '@mantine/core';

export interface NotificationProps {
  style?: Sx;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconifyIcon | string;
  iconColor?: string;
  position?: ToastPosition | 'top' | 'bottom';
  id?: number | string;
  type?: string;
  alignIcon?: 'top' | 'center';
}
