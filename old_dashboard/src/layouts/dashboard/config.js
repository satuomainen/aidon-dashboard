import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Momentary values',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ClockIcon/>
      </SvgIcon>
    )
  },
  {
    title: 'Time series',
    path: '/series',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Settings',
  //   path: '/settings',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // }
];
