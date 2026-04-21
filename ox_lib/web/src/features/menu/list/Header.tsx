import { Box, createStyles, Flex, Group, Text } from '@mantine/core';
import React from 'react';
import { useConfig } from '../../../providers/ConfigProvider';

const useStyles = createStyles((theme) => ({
  wrap: {
    // Outer panel already has radius + overflow:hidden — duplicate top radius here can leave a hairline above the banner in CEF
    overflow: 'hidden',
    width: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    // Base fill so gaps don’t show the panel container (was rgba(12) vs title rgba(8) = grey hairline)
    backgroundColor: 'rgba(8, 8, 8, 0.78)',
    isolation: 'isolate',
  },
  banner: {
    height: 78,
    width: '100%',
    flexShrink: 0,
    display: 'block',
    margin: 0,
    padding: 0,
    border: 'none',
    outline: 'none',
    lineHeight: 0,
    backgroundColor: '#161616',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'translateZ(0)',
  },
  titleBar: {
    marginTop: 0,
    position: 'relative',
    zIndex: 2,
    // Match list body — no borderBottom (that border read as a stuck grey bar)
    backgroundColor: 'rgba(8, 8, 8, 0.78)',
    padding: '8px 10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  titlePrefix: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.02,
  },
  titleCenter: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: 13,
    fontWeight: 600,
    '& p': { margin: 0, color: 'inherit' },
  },
  slot: {
    width: 40,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  slotLeft: {
    justifyContent: 'flex-start',
  },
  slotRight: {
    justifyContent: 'flex-end',
  },
}));

/** Safe for CSS `url()` (handles `()`, spaces, query strings). */
export function bannerBackgroundImage(url: string): { backgroundImage: string } {
  return { backgroundImage: `url(${JSON.stringify(url)})` };
}

export type MenuHeaderProps = {
  title: string;
  bannerImage?: string;
  titlePrefix?: string;
  /** Replaces plain title text (e.g. markdown). */
  titleContent?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const Header: React.FC<MenuHeaderProps> = ({
  title,
  bannerImage,
  titlePrefix,
  titleContent,
  leading,
  trailing,
}) => {
  const { classes, cx } = useStyles();
  const { config } = useConfig();
  const hasSlots = leading != null || trailing != null;

  const resolvedBanner = bannerImage ?? config.menuBannerImage;
  const resolvedPrefix = titlePrefix ?? config.menuTitlePrefix;

  const titleBlock = titleContent ?? <Text className={classes.title}>{title}</Text>;

  return (
    <Box className={classes.wrap}>
      <Box
        className={classes.banner}
        sx={resolvedBanner ? bannerBackgroundImage(resolvedBanner) : undefined}
      />
      <Box className={classes.titleBar}>
        {hasSlots ? (
          <Flex align="center" gap={8} w="100%" justify="space-between" wrap="nowrap">
            <Box className={cx(classes.slot, classes.slotLeft)}>{leading}</Box>
            <Box className={classes.titleCenter}>
              <Group spacing={6} noWrap position="center">
                {resolvedPrefix ? (
                  <Text component="span" className={classes.titlePrefix}>
                    {resolvedPrefix}
                  </Text>
                ) : null}
                {titleBlock}
              </Group>
            </Box>
            <Box className={cx(classes.slot, classes.slotRight)}>{trailing}</Box>
          </Flex>
        ) : (
          <Group spacing={6} noWrap align="center">
            {resolvedPrefix ? (
              <Text component="span" className={classes.titlePrefix}>
                {resolvedPrefix}
              </Text>
            ) : null}
            {titleBlock}
          </Group>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(Header);
