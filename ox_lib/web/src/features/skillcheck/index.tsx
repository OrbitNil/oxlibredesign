import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

/** Matches menus / progress: dark UI + white hairlines */
const strokeTrack = 'rgba(255, 255, 255, 0.14)';
const strokeTarget = 'rgba(255, 255, 255, 0.72)';
const strokeNeedle = 'rgba(255, 255, 255, 0.96)';

const useStyles = createStyles((_theme, params: { difficultyOffset: number }) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  frame: {
    position: 'relative',
    width: 500,
    height: 500,
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Subtle HUD disc — same language as ox_lib panels */
  hudRing: {
    position: 'absolute',
    width: 132,
    height: 132,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    backgroundColor: 'rgba(8, 8, 8, 0.88)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.55)',
    pointerEvents: 'none',
    '@media (min-height: 1440px)': {
      width: 168,
      height: 168,
    },
  },
  svg: {
    position: 'relative',
    zIndex: 1,
    width: 500,
    height: 500,
    overflow: 'visible',
    filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.5))',
  },
  track: {
    fill: 'transparent',
    stroke: strokeTrack,
    strokeWidth: 8,
    strokeLinecap: 'round',
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
    },
  },
  skillArea: {
    fill: 'transparent',
    stroke: strokeTarget,
    strokeWidth: 8,
    strokeLinecap: 'round',
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - (Math.PI * 50 * params.difficultyOffset) / 180,
    filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.12))',
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - (Math.PI * 65 * params.difficultyOffset) / 180,
    },
  },
  indicator: {
    stroke: strokeNeedle,
    strokeWidth: 14,
    strokeLinecap: 'round',
    fill: 'transparent',
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - 3,
    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.35))',
    '@media (min-height: 1440px)': {
      strokeWidth: 16,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - 5,
    },
  },
  keyBadge: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    minWidth: 28,
    height: 28,
    padding: '0 8px',
    textAlign: 'center',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'Roboto, system-ui, sans-serif',
    letterSpacing: '0.06em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: 'rgba(12, 12, 12, 0.92)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    '@media (min-height: 1440px)': {
      minWidth: 34,
      height: 34,
      fontSize: 20,
    },
  },
}));

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });
  const { classes } = useStyles({ difficultyOffset: skillCheck.difficultyOffset });

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  return (
    <>
      {visible && (
        <Box className={classes.overlay}>
          <Box className={classes.frame}>
            <Box className={classes.hudRing} aria-hidden />
            <svg className={classes.svg} viewBox="0 0 500 500">
              <circle className={classes.track} />
              <circle transform={`rotate(${skillCheck.angle}, 250, 250)`} className={classes.skillArea} />
              <Indicator
                angle={skillCheck.angle}
                offset={skillCheck.difficultyOffset}
                multiplier={
                  skillCheck.difficulty === 'easy'
                    ? 1
                    : skillCheck.difficulty === 'medium'
                    ? 1.5
                    : skillCheck.difficulty === 'hard'
                    ? 1.75
                    : skillCheck.difficulty.speedMultiplier
                }
                handleComplete={handleComplete}
                className={classes.indicator}
                skillCheck={skillCheck}
              />
            </svg>
            <Box className={classes.keyBadge}>{skillCheck.key.toUpperCase()}</Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SkillCheck;
