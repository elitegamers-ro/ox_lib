import { Button, createStyles } from '@mantine/core';
import { IconifyIcon } from '@iconify/react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconifyIcon | string;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 4,
    // flex: '1 9%',
    alignSelf: 'center',
    height: '35px',
    width: '35px',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? theme.colors.dark[2] : '#fff',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} />
    </Button>
  );
};

export default HeaderButton;
