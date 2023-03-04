
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker} from '@material-ui/pickers';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateRangeIcon from '@material-ui/icons/DateRange';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  popper: {
    // The popper clipped under the dialog during editing task.
    zIndex: theme.zIndex.modal + 2,
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  button: {
    minWidth: '121px',
  },
}));

// eslint-disable-next-line react/display-name
const datePicker = React.forwardRef((props, ref) => {
  const [selectedDate,
    setSelectedDate] = React.useState();
  const [anchorEl,
    setAnchorEl] = React.useState(null);
  const classes = useStyles();

  console.log('date picker: selected date', selectedDate);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ?
            null :
            event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ?
        'simple-popper' :
        undefined;

  const handleDateChange = (date) => {
    const formatDate = new Date(date).toISOString();
    setSelectedDate(formatDate);
  };

  const today = new Date().toISOString();
  const handleToday = () => {
    setSelectedDate(today);
  };

  const tomorrow = new Date(today);
  const formatTomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
  const handleTomorrow = () => {
    setSelectedDate(new Date(formatTomorrow).toISOString());
  };


  const handleClear = (date) => {
    setSelectedDate(undefined);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  const handleOk = (date) => {
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        value={selectedDate}
        ref={ref}>
        {selectedDate === undefined ?
          <DateRangeIcon /> :
          <DateRangeIcon color="primary" />}
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} className={classes.popper}>
        <Paper>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
              <div className={classes.buttonBox}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleToday}
                  color="primary">
              Today
                </Button>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleTomorrow}
                  color="primary">
              Tomorrow
                </Button>
              </div>
              <DatePicker
                disableToolbar
                disablePast
                variant="static"
                orientation="portrait"
                value={selectedDate}
                onChange={handleDateChange}/>
              <div className={classes.buttonBox}>
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={handleOk}
                  color="primary">
              Ok
                </Button>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleClear}
                  color="secondary">
              Clear
                </Button>
              </div>
            </div>
          </MuiPickersUtilsProvider>
        </Paper>
      </Popper>
    </div>
  );
});

export default datePicker;
