import { UnstyledButton, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  root: {
    borderRadius: theme.radius.sm,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color:
      params.canClose === false ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.82)',
    backgroundColor: 'transparent',
    transition: 'background-color 120ms ease',
    '&:hover': {
      backgroundColor:
        params.canClose === false ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
    },
    '&:disabled': {
      opacity: 0.4,
    },
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <UnstyledButton
      className={classes.root}
      disabled={canClose === false}
      onClick={handleClick}
      type="button"
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </UnstyledButton>
  );
};

export default HeaderButton;
