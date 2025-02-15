import { IconifyIcon } from '@iconify/react';
import React from 'react';

export type TextUiPosition = 'right-center' | 'left-center' | 'top-center' | 'bottom-center';

export interface TextUiProps {
  text: string;
  position?: TextUiPosition;
  icon?: IconifyIcon | string;
  iconColor?: string;
  style?: React.CSSProperties;
  alignIcon?: 'top' | 'center';
}
