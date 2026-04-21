import { Context, createContext, useContext, useEffect, useState } from 'react';
import { MantineColor } from '@mantine/core';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

export interface AppConfig {
  primaryColor: MantineColor;
  primaryShade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Resolved banner URL (always set in-game via getConfig). */
  menuBannerImage: string;
  menuTitlePrefix?: string;
}

interface ConfigCtxValue {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
}

const defaultTitlePrefix = '||';

const defaultConfig: AppConfig = {
  primaryColor: 'blue',
  primaryShade: 6,
  menuBannerImage: isEnvBrowser() ? '/images/menu_banner.svg' : '',
  menuTitlePrefix: defaultTitlePrefix,
};

const ConfigCtx = createContext<ConfigCtxValue | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    fetchNui<Partial<AppConfig>>('getConfig')
      .then((data) =>
        setConfig((prev) => ({
          ...prev,
          ...data,
          menuBannerImage: data.menuBannerImage || prev.menuBannerImage || '/images/menu_banner.svg',
          menuTitlePrefix: data.menuTitlePrefix ?? prev.menuTitlePrefix ?? defaultTitlePrefix,
        }))
      )
      .catch(() => setConfig(defaultConfig));
  }, []);

  return <ConfigCtx.Provider value={{ config, setConfig }}>{children}</ConfigCtx.Provider>;
};

export default ConfigProvider;

export const useConfig = () => useContext(ConfigCtx) as ConfigCtxValue;
