import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  isLast?: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string; isLast?: boolean }) => ({
  buttonContainer: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: '12px 14px',
    minHeight: 50,
    scrollMargin: 0,
    borderBottom: params.isLast ? undefined : '1px solid rgba(255, 255, 255, 0.06)',
    '&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      outline: 'none',
    },
  },
  iconImage: {
    maxWidth: 28,
  },
  buttonWrapper: {
    paddingLeft: 0,
    paddingRight: 0,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: 32,
    minWidth: 32,
    paddingTop: 2,
  },
  icon: {
    fontSize: 20,
    color: params.iconColor || 'rgba(255, 255, 255, 0.55)',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.25,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.35,
    marginTop: 4,
  },
  valueLine: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
  },
  chevronIcon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  scrollIndexValue: {
    color: 'rgba(255, 255, 255, 0.55)',
    textTransform: 'none',
    fontSize: 12,
  },
  progressStack: {
    width: '100%',
    marginRight: 0,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 6,
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: 15,
    fontWeight: 700,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(
  ({ item, index, scrollIndex, checked, isLast = false }, ref) => {
    const { classes } = useStyles({ iconColor: item.iconColor, isLast });

    return (
      <Box
        tabIndex={index}
        className={classes.buttonContainer}
        key={`item-${index}`}
        ref={(element: HTMLDivElement) => {
          if (ref)
            // @ts-ignore i cba
            return (ref.current = [...ref.current, element]);
        }}
      >
        <Group spacing={10} noWrap className={classes.buttonWrapper} align="flex-start">
          {item.icon && (
            <Box className={classes.iconContainer}>
              {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                <img src={item.icon} alt="" className={classes.iconImage} />
              ) : (
                <LibIcon
                  icon={item.icon as IconProp}
                  className={classes.icon}
                  fixedWidth
                  animation={item.iconAnimation}
                />
              )}
            </Box>
          )}
          {Array.isArray(item.values) ? (
            <Group position="apart" w="100%" align="flex-start" noWrap>
              <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                <Text className={classes.title}>{item.label}</Text>
                <Text className={classes.valueLine}>
                  {typeof item.values[scrollIndex] === 'object'
                    ? // @ts-ignore
                      item.values[scrollIndex].label
                    : item.values[scrollIndex]}
                </Text>
                {item.description && (
                  <Text className={classes.description}>{item.description}</Text>
                )}
              </Stack>
              <Group spacing={4} position="center" sx={{ flexShrink: 0, paddingTop: 2 }}>
                <LibIcon icon="chevron-left" className={classes.chevronIcon} />
                <Text className={classes.scrollIndexValue}>
                  {scrollIndex + 1}/{item.values.length}
                </Text>
                <LibIcon icon="chevron-right" className={classes.chevronIcon} />
              </Group>
            </Group>
          ) : item.checked !== undefined ? (
            <Group position="apart" w="100%" align="flex-start" noWrap>
              <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                <Text className={classes.title}>{item.label}</Text>
                {item.description && (
                  <Text className={classes.description}>{item.description}</Text>
                )}
              </Stack>
              <CustomCheckbox checked={checked}></CustomCheckbox>
            </Group>
          ) : item.progress !== undefined ? (
            <Stack className={classes.progressStack} spacing={0} sx={{ flex: 1 }}>
              <Text className={classes.progressLabel}>{item.label}</Text>
              {item.description && (
                <Text className={classes.description} sx={{ marginBottom: 8, marginTop: -4 }}>
                  {item.description}
                </Text>
              )}
              <Progress
                value={item.progress}
                color={item.colorScheme || 'gray'}
                styles={{
                  root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  },
                  bar: {
                    backgroundColor:
                      item.colorScheme && item.colorScheme !== 'gray'
                        ? undefined
                        : 'rgba(255, 255, 255, 0.72)',
                  },
                }}
              />
            </Stack>
          ) : (
            <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
              <Text className={classes.title}>{item.label}</Text>
              {item.description && (
                <Text className={classes.description}>{item.description}</Text>
              )}
            </Stack>
          )}
        </Group>
      </Box>
    );
  }
);

export default React.memo(ListItem);
