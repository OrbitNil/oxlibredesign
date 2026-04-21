import React from 'react';
import { Box, createStyles, keyframes, RingProgress, Text, Stack } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';
import { progressLabelColor, progressMutedColor } from './progressTheme';

const ringR = 33.5;

const progressCircle = keyframes({
  '0%': { strokeDasharray: `0, ${ringR * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${ringR * 2 * Math.PI}, 0` },
});

const useStyles = createStyles((_theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '22%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  ringWrap: {
    alignItems: 'center',
    padding: 0,
    backgroundColor: 'transparent',
  },
  inner: {
    marginTop: params.position === 'middle' ? 20 : undefined,
    backgroundColor: 'transparent',
  },
  /**
   * Mantine draws the root ring first (grey “track”), then the section arc.
   * First circle = invisible track — only the animated arc stays visible.
   */
  progress: {
    backgroundColor: 'transparent',
    '& svg': {
      backgroundColor: 'transparent',
    },
    '& svg circle': {
      fill: 'none',
    },
    '& svg circle:nth-of-type(1)': {
      stroke: 'transparent',
    },
    '& svg circle:nth-of-type(2)': {
      stroke: 'rgba(255, 255, 255, 0.92)',
      transition: 'none',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: 13,
    fontWeight: 600,
    color: progressLabelColor,
  },
  ringLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
    marginTop: 10,
    color: progressMutedColor,
    maxWidth: 220,
    lineHeight: 1.35,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel((data.label && String(data.label).trim()) || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <Stack spacing={0} className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Box className={classes.inner}>
          <Stack spacing={0} align="center" className={classes.ringWrap}>
            <RingProgress
              size={96}
              thickness={6}
              sections={[{ value: 100, color: 'dark' }]}
              rootColor="transparent"
              onAnimationEnd={() => setVisible(false)}
              className={classes.progress}
              styles={{
                root: { backgroundColor: 'transparent' },
              }}
              label={<Text className={classes.value}>{value}%</Text>}
            />
            {label ? (
              <Text className={classes.ringLabel}>{label}</Text>
            ) : null}
          </Stack>
        </Box>
      </ScaleFade>
    </Stack>
  );
};

export default CircleProgressbar;
