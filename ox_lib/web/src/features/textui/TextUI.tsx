import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import {
  progressLabelColor,
  progressMutedColor,
  progressPanelSurface,
} from '../progress/progressTheme';

/** Same dark glass + grid as Progressbar / ox_lib HUD panels */
const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center' ? 'baseline' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
    pointerEvents: 'none',
  },
  panel: {
    maxWidth: 'min(380px, calc(100vw - 40px))',
    margin: 12,
    padding: '14px 18px 16px',
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
  iconWrap: {
    flexShrink: 0,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  },
  body: {
    minWidth: 0,
    flex: 1,
    color: progressLabelColor,
    fontSize: 14,
    lineHeight: 1.55,
    fontFamily: 'Roboto, system-ui, sans-serif',
    fontWeight: 400,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.75)',
    '& p': {
      margin: 0,
      marginBottom: 10,
      color: progressLabelColor,
    },
    '& p:last-child': { marginBottom: 0 },
    '& strong': {
      color: 'rgba(255, 255, 255, 0.96)',
      fontWeight: 600,
    },
    '& em': { color: progressMutedColor },
    '& a': {
      color: 'rgba(200, 215, 255, 0.92)',
      textDecoration: 'underline',
      textUnderlineOffset: 2,
    },
    '& ul, & ol': {
      margin: '6px 0 0',
      paddingLeft: 20,
      color: progressLabelColor,
    },
    '& li': { marginBottom: 4 },
    '& code': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 12,
      padding: '2px 6px',
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      color: progressMutedColor,
    },
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  const alignTop = data.alignIcon === 'top';

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.panel}>
            <Group spacing={14} noWrap align={alignTop ? 'flex-start' : 'center'}>
              {data.icon && (
                <Box className={classes.iconWrap}>
                  <LibIcon
                    icon={data.icon}
                    fixedWidth
                    size="lg"
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor ?? 'rgba(255, 255, 255, 0.82)',
                      filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.6))',
                    }}
                  />
                </Box>
              )}
              <Box className={classes.body}>
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {data.text}
                </ReactMarkdown>
              </Box>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
