import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
    width: 350,
    height: 15,
    borderRadius: '0.75rem',
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
  labelWrapper: {
    display: 'flex',
    width: 350,
    height: 45,
    top: -54,
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
    display: 'flex',
    width: 350,
    height: 45,
    bottom: 35,
    background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5), transparent)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrapper: {
    display: 'flex',
    width: '100%',
    height: '1.5rem',
    gap: 5,
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(to right, #991b1b, #b91c1c)',
    borderRadius: 9999,
  },
  percentageLabel: {
    position: 'absolute',
    right: '-3.75rem',
    fontSize: 18,
    width: '3.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    bottom: '50%',
    transform: 'translateY(50%)',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setElapsedTime(0);
    setPercentage(0);
  });

  useEffect(() => {
    if (duration > 0 && visible) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 100;
          if (newTime >= duration) {
            clearInterval(interval);
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, visible]);

  useEffect(() => {
    if (duration > 0) {
      const newPercentage = Math.min((elapsedTime / duration) * 100, 100);
      setPercentage(newPercentage);
    }
  }, [elapsedTime, duration]);

  return (
    <Box className={classes.wrapper}>
      <Box style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {visible ?
          <Box className={classes.labelWrapper}>
            <Text className={classes.label}>{label}</Text>
          </Box>
        : null}
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

          <Box className={classes.percentageLabel}>
            <Text>
              {Math.floor(percentage)}%
            </Text>
          </Box>
        </ScaleFade>

      {visible ?
        <Box className={classes.labelCancelWrapper}>
          <Text className={classes.label}>Apasa "X" pentru a opri actiunea</Text>
        </Box>
      : null}
      </Box>
    </Box>
  );
};

export default Progressbar;
