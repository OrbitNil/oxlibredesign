import {
  Box,
  createStyles,
  Group,
  HoverCard,
  Image,
  Progress,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean; isLast?: boolean }) => ({
  row: {
    width: '100%',
    display: 'block',
    padding: '12px 14px',
    textAlign: 'left',
    borderRadius: 0,
    borderBottom: params.isLast ? undefined : '1px solid rgba(255, 255, 255, 0.06)',
    backgroundColor: 'transparent',
    cursor: params.disabled ? 'not-allowed' : params.readOnly ? 'default' : 'pointer',
    opacity: params.disabled ? 0.45 : 1,
    transition: 'background-color 120ms ease',
    '&:hover': {
      backgroundColor:
        params.disabled || params.readOnly ? 'transparent' : 'rgba(255, 255, 255, 0.06)',
    },
  },
  titleBlock: {
    width: '100%',
    color: params.disabled ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.98)',
    whiteSpace: 'pre-wrap',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.25,
    '& p': { margin: 0 },
  },
  iconImage: {
    maxWidth: 26,
    maxHeight: 26,
  },
  description: {
    color: params.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.52)',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.35,
    marginTop: 4,
    '& p': { margin: 0 },
  },
  dropdown: {
    padding: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    maxWidth: 280,
    width: 'fit-content',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(20, 20, 20, 0.97)',
    boxShadow: theme.shadows.md,
  },
  buttonStack: {
    gap: 0,
    flex: 1,
    minWidth: 0,
  },
  buttonGroup: {
    gap: 10,
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  buttonIconContainer: {
    width: 28,
    minWidth: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    minWidth: 24,
    color: 'rgba(255, 255, 255, 0.45)',
    flexShrink: 0,
    paddingTop: 2,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    marginBottom: 6,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
  isLast?: boolean;
}> = ({ option, isLast = false }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes, cx } = useStyles({ disabled: button.disabled, readOnly: button.readOnly, isLast });

  return (
    <HoverCard
      position="right-start"
      disabled={button.disabled || !(button.metadata || button.image)}
      openDelay={200}
      styles={{
        dropdown: { border: 'none', background: 'transparent', padding: 0 },
      }}
    >
      <HoverCard.Target>
        <UnstyledButton
          className={classes.row}
          onClick={() =>
            !button.disabled && !button.readOnly
              ? button.menu
                ? openMenu(button.menu)
                : clickContext(buttonKey)
              : undefined
          }
          disabled={button.disabled}
          type="button"
        >
          <Group position="apart" w="100%" noWrap align="flex-start">
            <Stack className={classes.buttonStack}>
              {(button.title || Number.isNaN(+buttonKey)) && (
                <Group className={classes.buttonGroup}>
                  {button?.icon && (
                    <Stack className={classes.buttonIconContainer}>
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img src={button.icon} className={classes.iconImage} alt="" />
                      ) : (
                        <LibIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          size="lg"
                          style={{ color: button.iconColor || 'rgba(255, 255, 255, 0.55)' }}
                          animation={button.iconAnimation}
                        />
                      )}
                    </Stack>
                  )}
                  <Text component="div" className={cx(classes.buttonTitleText, classes.titleBlock)}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {button.title || buttonKey}
                    </ReactMarkdown>
                  </Text>
                </Group>
              )}
              {button.description && (
                <Text className={classes.description} pl={button.icon ? 36 : 0}>
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </Text>
              )}
              {button.progress !== undefined && (
                <Box pl={button.icon ? 36 : 0} pt={4} w="100%">
                  <Progress
                    value={button.progress}
                    size="sm"
                    color={button.colorScheme || 'gray'}
                    styles={{
                      root: { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                      bar: {
                        backgroundColor:
                          button.colorScheme && button.colorScheme !== 'gray'
                            ? undefined
                            : 'rgba(255, 255, 255, 0.72)',
                      },
                    }}
                  />
                </Box>
              )}
            </Stack>
            {(button.menu || button.arrow) && button.arrow !== false && (
              <Stack className={classes.buttonArrowContainer}>
                <LibIcon icon="chevron-right" fixedWidth />
              </Stack>
            )}
          </Group>
        </UnstyledButton>
      </HoverCard.Target>
      <HoverCard.Dropdown className={classes.dropdown}>
        {button.image && <Image src={button.image} mb={8} radius="sm" />}
        {Array.isArray(button.metadata) ? (
          button.metadata.map(
            (
              metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
              index: number
            ) => (
              <React.Fragment key={`context-metadata-${index}`}>
                <Text className={classes.metaText}>
                  {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                </Text>

                {typeof metadata === 'object' && metadata.progress !== undefined && (
                  <Progress
                    value={metadata.progress}
                    size="sm"
                    color={metadata.colorScheme || button.colorScheme || 'gray'}
                    mb={8}
                    styles={{
                      root: { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                      bar: {
                        backgroundColor:
                          metadata.colorScheme || button.colorScheme
                            ? undefined
                            : 'rgba(255, 255, 255, 0.72)',
                      },
                    }}
                  />
                )}
              </React.Fragment>
            )
          )
        ) : button.metadata &&
          typeof button.metadata === 'object' &&
          !Array.isArray(button.metadata) ? (
          Object.entries(button.metadata).map((entry, index) => (
            <Text key={`context-metadata-${index}`} className={classes.metaText}>
              {entry[0]}: {String(entry[1])}
            </Text>
          ))
        ) : null}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;
