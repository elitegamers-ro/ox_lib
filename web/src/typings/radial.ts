import { IconifyIcon } from '@iconify/react';

export interface RadialMenuItem {
  icon: IconifyIcon | string;
  label: string;
  isMore?: boolean;
  menu?: string;
}
