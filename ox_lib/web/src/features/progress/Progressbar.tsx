import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';
import {
  progressLabelColor,
  progressPanelSurface,
  progressTrackBg,
  progressTrackStroke,
} from './progressTheme';

/**
 * Linear progress — B/W ox_lib theme. Track uses skewX for a parallelogram bar
 * (fill + empty area skew together).
 */
const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    paddingBottom: 28,
    pointerEvents: 'none',
  },
  panel: {
    width: 'min(440px, calc(100vw - 48px))',
    padding: '14px 20px 18px',
    borderRadius: theme.radius.md,
    border: progressPanelSurface.border,
    boxShadow: progressPanelSurface.boxShadow,
    overflow: 'hidden',
    background: `
      linear-gradient(rgba(8, 8, 8, 0.94), rgba(8, 8, 8, 0.94)),
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: 'auto, 10px 10px, 10px 10px',
  },
  status: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: progressLabelColor,
    textAlign: 'right',
    width: '100%',
    marginBottom: 10,
    paddingInline: 2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontFamily: 'Roboto, system-ui, sans-serif',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.9)',
  },
  /** Padding so a skewed track isn’t clipped by `panel` overflow */
  trackSkewWrap: {
    padding: '4px 10px 2px',
  },
  /**
   * Parallelogram track: empty slot + fill share the same skew (industrial HUD look).
   */
  trackShell: {
    position: 'relative',
    height: 16,
    overflow: 'hidden',
    boxSizing: 'border-box',
    transform: 'skewX(-11deg)',
    transformOrigin: 'center',
    border: `1px solid ${progressTrackStroke}`,
    backgroundColor: progressTrackBg,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 0 -1px 0 rgba(0, 0, 0, 0.45)',
  },
  fill: {
    height: '100%',
    width: '100%',
    transformOrigin: 'left center',
    background: `linear-gradient(
      90deg,
      #ffffff 0%,
      rgba(240, 240, 240, 0.95) 45%,
      rgba(140, 140, 140, 0.55) 100%
    )`,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  const display = (label && label.trim()) || 'Progress';

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Box className={classes.panel}>
          <Text className={classes.status}>{display}</Text>
          <Box className={classes.trackSkewWrap}>
            <Box className={classes.trackShell}>
              <Box
                className={classes.fill}
                onAnimationEnd={() => setVisible(false)}
                sx={{
                  animation: 'progress-bar linear forwards',
                  animationDuration: `${duration}ms`,
                }}
              />
            </Box>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Progressbar;
