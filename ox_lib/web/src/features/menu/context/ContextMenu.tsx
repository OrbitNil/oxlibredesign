import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import Header from '../list/Header';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  outer: {
    position: 'absolute',
    top: '12%',
    right: '22%',
    width: 320,
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    borderRadius: theme.radius.md,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    // Top border sits just above the banner; same color as fill removes the visible hairline in CEF
    borderTopColor: 'rgba(8, 8, 8, 0.78)',
    backgroundColor: 'rgba(8, 8, 8, 0.78)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
    overflow: 'hidden',
  },
  buttonsContainer: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    backgroundColor: 'rgba(8, 8, 8, 0.78)',
    borderTop: 'none',
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  const titleMarkdown = (
    <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
  );

  // Only mount the shell while open: an empty outer (border + positioning) still paints a ~1px hairline in CEF
  if (!visible) return null;

  return (
    <Box className={classes.outer}>
      <ScaleFade visible>
        <Header
          title={contextMenu.title}
          titleContent={titleMarkdown}
          bannerImage={contextMenu.bannerImage}
          titlePrefix={contextMenu.titlePrefix}
          leading={
            contextMenu.menu ? (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            ) : undefined
          }
          trailing={
            <HeaderButton
              icon="xmark"
              canClose={contextMenu.canClose}
              iconSize={16}
              handleClick={closeContext}
            />
          }
        />
        <Box className={classes.buttonsContainer}>
          {Object.entries(contextMenu.options).map((option, index, arr) => (
            <ContextButton
              option={option}
              key={`context-item-${index}`}
              isLast={index === arr.length - 1}
            />
          ))}
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
