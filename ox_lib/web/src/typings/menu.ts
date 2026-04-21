import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconAnimation } from '../components/LibIcon';

export type MenuPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MenuItem {
  image?: string;
  label: string;
  progress?: number;
  colorScheme?: string;
  checked?: boolean;
  values?: Array<string | { label: string; description: string }>;
  description?: string;
  icon?: IconProp | string;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  defaultIndex?: number;
  close?: boolean;
}

export interface MenuSettings {
  position?: MenuPosition;
  title: string;
  /** URL for the top banner (`https://...` or `nui://resource/path/...`). */
  bannerImage?: string;
  /** Shown before the title in the header bar (e.g. `||`). */
  titlePrefix?: string;
  canClose?: boolean;
  items: Array<MenuItem>;
  startItemIndex?: number;
}
