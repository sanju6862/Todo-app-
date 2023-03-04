
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    minWidth: '128px',
    margin: theme.spacing(1),
  },
}));

// eslint-disable-next-line require-jsdoc
export default function AddTask(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={props.onConfirm}
          startIcon={<AddCircleOutlineIcon />}
        >
        Add Task
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={props.onCancel}
          startIcon={<HighlightOffIcon />}
        >
        Cancel
        </Button>
      </Grid>
      <Grid>
        {props.children}
      </Grid>
    </div>
  );
};
