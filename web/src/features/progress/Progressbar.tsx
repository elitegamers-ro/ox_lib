import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 350,
    height: 15,
    borderRadius: 9999,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(to right, #991b1b, #b91c1c)',
    borderRadius: 9999,
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 350,
    height: 45,
    top: 50,
    background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5), transparent)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    maxWidth: 350,
    padding: 8,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 20,
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
  },
  labelCancelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 350,
    height: 45,
    bottom: 50,
    background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5), transparent)',
    alignItems: 'center',
    justifyContent: 'center',
  }
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

  return (
    <>
      <Box className={classes.wrapper}>
        <Box className={classes.labelWrapper}>
          <Text className={classes.label}>{label}</Text>
        </Box>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            >
            </Box>
          </Box>
        </ScaleFade>
        <Box className={classes.labelCancelWrapper}>
          <Text className={classes.label}>Apasa "X" pentru a opri actiunea</Text>
        </Box>
      </Box>
    </>
  );
};

export default Progressbar;
