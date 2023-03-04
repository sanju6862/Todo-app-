
import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  action: {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3, 3, 3),
  },
}));

// eslint-disable-next-line require-jsdoc
export default function Modal(props) {
  const classes = useStyles();
  return (
    <Dialog
      open
      fullWidth
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
      <DialogContent>
        {props.children}
      </DialogContent>
      <DialogActions
        className={classes.action}>
        <Button
          onClick={props.onConfirm}
          variant="contained"
          color="primary">
            Confirm
        </Button>
        <Button
          onClick={props.onCancel}
          variant="outlined"
          color="secondary">
            Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
