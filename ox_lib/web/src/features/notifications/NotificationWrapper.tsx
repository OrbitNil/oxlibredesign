import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles(() => ({
  container: {
    width: 300,
    maxWidth: 'min(300px, 92vw)',
    height: 'fit-content',
    backgroundColor: 'rgba(12, 12, 12, 0.94)',
    color: 'rgba(255, 255, 255, 0.96)',
    padding: 0,
    borderRadius: 10,
    fontFamily: 'Roboto, system-ui, sans-serif',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    overflow: 'hidden',
    // Solid panel only — no backdrop-filter (FiveM CEF)
  },
  inner: {
    padding: '12px 14px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1.35,
    letterSpacing: 0.01,
    color: 'rgba(255, 255, 255, 0.97)',
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: 'Roboto, system-ui, sans-serif',
    lineHeight: 1.45,
    marginTop: 4,
    '& a': {
      color: 'rgba(200, 220, 255, 0.9)',
      textDecoration: 'underline',
    },
    '& p': { margin: 0 },
    '& p + p': { marginTop: 6 },
  },
  descriptionOnly: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.78)',
    fontFamily: 'Roboto, system-ui, sans-serif',
    lineHeight: 1.45,
    '& a': {
      color: 'rgba(200, 220, 255, 0.9)',
    },
    '& p': { margin: 0 },
  },
  iconDisc: {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'inherit',
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: {
      opacity: visible ? 0 : 1,
      transform: `translate${from}`,
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: `translate${to}`,
    },
  });

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards' : '0.35s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom')
      ? { from: 'Y(16px)', to: 'Y(0px)' }
      : { from: 'Y(-16px)', to: 'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(110%)' };
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-110%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-120%)' };
    } else if (position === 'bottom-center') {
      animation = { from: 'Y(0px)', to: 'Y(120%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(110%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

function typeAccentColor(type?: string): string {
  switch (type) {
    case 'error':
      return 'rgba(232, 120, 120, 0.95)';
    case 'success':
      return 'rgba(130, 200, 165, 0.95)';
    case 'warning':
      return 'rgba(220, 190, 120, 0.95)';
    default:
      return 'rgba(255, 255, 255, 0.42)';
  }
}

function defaultIconRgb(type?: string): string {
  switch (type) {
    case 'error':
      return 'rgba(255, 150, 150, 0.95)';
    case 'success':
      return 'rgba(160, 220, 190, 0.95)';
    case 'warning':
      return 'rgba(240, 210, 140, 0.95)';
    default:
      return 'rgba(255, 255, 255, 0.82)';
  }
}

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let iconColor: string;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey((prevKey) => prevKey + 1);

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      iconColor = defaultIconRgb(data.type);
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    const accent = typeAccentColor(data.type);

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={classes.container}
          style={{
            borderLeft: `3px solid ${accent}`,
            boxSizing: 'border-box',
          }}
        >
          <Box className={classes.inner}>
            <Group noWrap spacing={12} align={!data.alignIcon || data.alignIcon === 'center' ? 'center' : 'flex-start'}>
              {data.icon && (
                <>
                  {data.showDuration ? (
                    <RingProgress
                      key={toastKey}
                      size={42}
                      thickness={2.5}
                      roundCaps
                      sections={[{ value: 100, color: accent as never }]}
                      style={{
                        alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'flex-start',
                        flexShrink: 0,
                      }}
                      styles={{
                        root: {
                          margin: -2,
                          '& > svg > circle:first-of-type': {
                            stroke: 'rgba(255, 255, 255, 0.12)',
                          },
                          '& > svg > circle:nth-of-type(2)': {
                            animation: `${durationCircle} linear forwards reverse`,
                            animationDuration: `${duration}ms`,
                          },
                        },
                      }}
                      label={
                        <Center>
                          <Box
                            className={classes.iconDisc}
                            style={{
                              width: 34,
                              height: 34,
                              minWidth: 34,
                              border: 'none',
                              backgroundColor: 'rgba(255, 255, 255, 0.07)',
                            }}
                          >
                            <LibIcon
                              icon={data.icon}
                              fixedWidth
                              style={{ color: iconColor }}
                              animation={data.iconAnimation}
                            />
                          </Box>
                        </Center>
                      }
                    />
                  ) : (
                    <Box
                      className={classes.iconDisc}
                      style={{
                        alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'flex-start',
                      }}
                    >
                      <LibIcon icon={data.icon} fixedWidth style={{ color: iconColor }} animation={data.iconAnimation} />
                    </Box>
                  )}
                </>
              )}
              <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                {data.title && <Text className={classes.title}>{data.title}</Text>}
                {data.description && (
                  <ReactMarkdown
                    components={MarkdownComponents}
                    className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                  >
                    {data.description}
                  </ReactMarkdown>
                )}
              </Stack>
            </Group>
          </Box>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return (
    <Toaster
      gutter={10}
      toastOptions={{
        className: 'ox-toast-host',
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          maxWidth: 'none',
        },
      }}
    />
  );
};

export default Notifications;
