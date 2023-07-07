import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const MomentaryValue = (props) => {
  const { title, value, received, icon, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {title}
            </Typography>
            <Typography variant="h5">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'info.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              {icon}
            </SvgIcon>
          </Avatar>
        </Stack>
        {received &&
            <Stack>
              <Typography
                variant="info"
                style={{marginTop: '6px'}}
              >
                Updated {new Date(received).toLocaleString('fi-FI')}
              </Typography>
            </Stack>
        }
      </CardContent>
    </Card>
  );
};

MomentaryValue.prototypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  received: PropTypes.number,
  icon: PropTypes.node
};
