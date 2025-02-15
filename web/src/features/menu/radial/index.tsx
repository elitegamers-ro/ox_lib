import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  sector: {
    fill: '#18181b',
    color: theme.colors.dark[0],

    '&:hover': {
      cursor: 'pointer',
      fill: '#b91c1c',
      '> g > text, > g > svg > path': {
        fill: '#fff',
      },
    },
    '> g > text': {
      fill: theme.colors.dark[0],
    },
  },
  backgroundCircle: {
    fill: '#18181b',
  },
  centerCircle: {
    fill: '#b91c1c',
    color: '#fff',
    stroke: '#18181b',
    strokeWidth: 4,
    '&:hover': {
      cursor: 'pointer',
      fill: '#b91c1c',
    },
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  centerIcon: {
    color: '#fff',
    fontSize: 50,
  },
}));

// includes More... button
const PAGE_ITEMS = 6;

const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        setVisible(false);
        fetchNui('radialClose');
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [visible]);

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');

    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'uil:ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
        <ScaleFade visible={visible}>
          <svg width="500px" height="500px" transform="rotate(90)">
            {/*Fixed issues with background circle extending the circle when there's less than 3 items*/}
            <g transform="translate(250, 250)">
              <circle r={250} className={classes.backgroundCircle} />
            </g>
            {menuItems.map((item, index) => {
              // Always draw full circle to avoid elipse circles with 2 or less items
              const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
              const angle = degToRad(pieAngle / 2 + 90);
              const gap = 0;
              const radius = 250 * 0.65 - gap;
              const sinAngle = Math.sin(angle);
              const cosAngle = Math.cos(angle);
              const iconX = 250 + sinAngle * radius;
              const iconY = 250 + cosAngle * radius;

              return (
                <>
                  <g
                    transform={`rotate(-${index * pieAngle} 250 250) translate(${sinAngle * gap}, ${cosAngle * gap})`}
                    className={classes.sector}
                    onClick={async () => {
                      const clickIndex =
                        menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                      if (!item.isMore) fetchNui('radialClick', clickIndex);
                      else {
                        await changePage(true);
                      }
                    }}
                  >
                    <path
                      d={`M250,250 l${250 - gap},0 A250,250 0 0,0 ${
                        250 + (250 - gap) * Math.cos(-degToRad(pieAngle))
                      }, ${250 + (250 - gap) * Math.sin(-degToRad(pieAngle))} z`}
                    />
                    <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                      <LibIcon x={iconX - 12.5} y={iconY - 17.5} icon={item.icon} width={25} height={25} />
                      <text
                        x={iconX}
                        y={iconY + (item.label.includes('  \n') ? 7 : 25)}
                        fill="#fff"
                        textAnchor="middle"
                        pointerEvents="none"
                        fontSize="12" // Adjusted font size
                      >
                        {item.label.includes('  \n')
                          ? item.label.split('  \n').map((value) => (
                              <tspan x={iconX} dy="1.2em">
                                {value}
                              </tspan>
                            ))
                          : item.label}
                      </text>
                    </g>
                  </g>
                </>
              );
            })}
            <g
              transform={`translate(250, 250)`}
              onClick={async () => {
                if (menu.page > 1) await changePage();
                else {
                  if (menu.sub) fetchNui('radialBack');
                  else {
                    setVisible(false);
                    fetchNui('radialClose');
                  }
                }
              }}
            >
              <circle r={40} className={classes.centerCircle} />
            </g>
          </svg>
          <div className={classes.centerIconContainer}>
            <LibIcon
              icon={!menu.sub && menu.page < 2 ? 'iconamoon:close-bold' : 'lucide:rotate-ccw'}
              className={classes.centerIcon}
            />
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
