

import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: '1px',
    width: '150px',
  },
}));

// eslint-disable-next-line require-jsdoc
export default function MyDivider() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider
        className={classes.divider}
        variant='middle'
        component='div'/>
      <Typography
        color='primary'
        align= 'center'
      >OR</Typography>
      <Divider
        className={classes.divider}
        variant='middle'
        component='div'/>
    </div>
  );
};
