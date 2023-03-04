
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  overview: {
    padding: theme.spacing(0.5, 0),
  },
}));

// eslint-disable-next-line require-jsdoc
export default function Overview(props) {
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item sm={6} md={6} lg={6} className={classes.overview}>
          <Typography
            component="h2"
            variant="h4"
            color="primary"
            align="center"
            gutterBottom>
            {props.complete}
          </Typography>
          <Typography
            component="h2"
            variant="h6"
            color="disabled"
            align="center"
            gutterBottom>
          Complete
          </Typography>
          <Divider variant="middle"/>
        </Grid>
        <Grid item sm={6} md={6} lg={6} className={classes.overview}>
          <Typography
            component="h2"
            variant="h4"
            color="secondary"
            align="center"
            gutterBottom>
            {props.incomplete}
          </Typography>
          <Typography
            component="h2"
            variant="h6"
            color="disabled"
            align="center"
            gutterBottom>
          Incomplete
          </Typography>
          <Divider variant="middle"/>
        </Grid>
        <Grid item sm={6} md={6} lg={6} className={classes.overview}>
          <Typography
            component="h2"
            variant="h4"
            color="secondary"
            align="center"
            gutterBottom>
            {props.overdue}
          </Typography>
          <Typography
            component="h2"
            variant="h6"
            color="disabled"
            align="center"
            gutterBottom>
          Overdue
          </Typography>
        </Grid>
        <Grid item sm={6} md={6} lg={6} className={classes.overview}>
          <Typography
            component="h2"
            variant="h4"
            color="primary"
            align="center"
            gutterBottom>
            {props.total}
          </Typography>
          <Typography
            component="h2"
            variant="h6"
            color="disabled"
            align="center"
            gutterBottom>
          Total
          </Typography>
        </Grid>
      </Grid>
    </div>);
}
