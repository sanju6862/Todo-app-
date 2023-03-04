

import 'date-fns';
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LoopIcon from '@material-ui/icons/Loop';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  popper: {
    // The popper clipped under the dialog during editing task.
    zIndex: theme.zIndex.modal,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  picker: {
    margin: theme.spacing(0.5),
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  button: {
    margin: theme.spacing(0.4),
    minWidth: 121,
  },
  title: {
    padding: theme.spacing(0.5),
  },
  number: {
    maxWidth: 121,
    margin: theme.spacing(0.5),
  },
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: 121,
  },
}));

// eslint-disable-next-line react/display-name
const repeatTask = React.forwardRef((props, ref) => {
  const [selectedStartDate,
    setSelectedStartDate] = React.useState(new Date().toISOString());
  const [selectedEndDate,
    setSelectedEndDate] = React.useState(new Date().toISOString());
  const [anchorEl,
    setAnchorEl] = React.useState(null);
  const [dateArray,
    setDateArray] = React.useState();
  console.log(dateArray);
  const [frequencyK,
    setFrequencyK] = React.useState(1);
  const [frequencyN,
    setFrequencyN] = React.useState();
  const [custom,
    setCustom] = React.useState(false);
  const classes = useStyles();


  const handleClick = (event) => {
    setAnchorEl(anchorEl ?
            null :
            event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ?
        'repeat-popper' :
        undefined;

  const handleStartDateChange = (date) => {
    const formatDate = new Date(date).toISOString();
    setSelectedStartDate(formatDate);
  };

  const handleEndDateChange = (date) => {
    const formatDate = new Date(date).toISOString();
    setSelectedEndDate(formatDate);
  };

  const handleDaily = (date) => {
    const dateArr = [selectedStartDate, selectedEndDate, 1, 'day'];
    setDateArray(dateArr);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  const handleWeekly = (date) => {
    const dateArr = [selectedStartDate, selectedEndDate, 1, 'week'];
    setDateArray(dateArr);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  const handleMonthly = (date) => {
    const dateArr = [selectedStartDate, selectedEndDate, 1, 'month'];
    setDateArray(dateArr);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  const handleYearly = (date) => {
    const dateArr = [selectedStartDate, selectedEndDate, 1, 'year'];
    setDateArray(dateArr);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  const handleCustom = () => {
    setCustom(!custom);
  };

  const handleFrequencyK = (event) => {
    setDateArray([]);
    setFrequencyK( parseInt(event.target.value));
  };

  const handleFrequencyN = (event) => {
    setDateArray([]);
    setFrequencyN(event.target.value);
  };

  const handleClear = (date) => {
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
    setDateArray([]);
    setFrequencyK(1);
    setFrequencyN(undefined);
    setCustom(false);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };
  const handleOk = (date) => {
    const dateArr = [selectedStartDate, selectedEndDate, frequencyK, frequencyN];
    console.log('new dateArray:', dateArr, typeof dateArray.length);
    setDateArray(dateArr);
    setCustom(false);
    setAnchorEl(anchorEl ?
            null :
            date.currentTarget);
  };

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        value={dateArray}
        ref={ref}>
        {dateArray? <LoopIcon color="primary" />: <LoopIcon />}
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} className={classes.popper}>
        <Paper>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
              <KeyboardDatePicker
                className={classes.picker}
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Start"
                format="MM/dd/yyyy"
                margin="normal"
                value={selectedStartDate}
                InputAdornmentProps={{
                  position: 'start',
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onChange={(date) => handleStartDateChange(date)}/>
              <KeyboardDatePicker
                className={classes.picker}
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="End by"
                format="MM/dd/yyyy"
                value={selectedEndDate}
                InputAdornmentProps={{
                  position: 'start',
                }}
                onChange={(date) => handleEndDateChange(date)}/>
              <div className={classes.buttonBox}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleDaily}
                  color="primary">
                  Daily
                </Button>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleWeekly}
                  color="primary">
                  Weekly
                </Button>
              </div>
              <div className={classes.buttonBox}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleMonthly}
                  color="primary">
                  Monthly
                </Button>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={handleYearly}
                  color="primary">
                  Yearly
                </Button>
              </div>
              <Button
                className={classes.button}
                variant="outlined"
                onClick={handleCustom}
                color="primary">
                  Set Custom
              </Button>
              {custom && <div className={classes.customButton}>
                <TextField
                  className={classes.number}
                  id="outlined-number"
                  label="Every"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={frequencyK}
                  onClick
                    ={handleFrequencyK}
                  variant="outlined"/>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="select-outlined-label">Set Repeat</InputLabel>
                  <Select
                    labelId="select-outlined-label"
                    id="select-outlined"
                    value={frequencyN}
                    onChange={handleFrequencyN}
                    label="Set Repeat"
                    variant="outlined">
                    <MenuItem value={'day'}>Day</MenuItem>
                    <MenuItem value={'week'}>Week</MenuItem>
                    <MenuItem value={'month'}>Month</MenuItem>
                    <MenuItem value={'year'}>Year</MenuItem>
                  </Select>
                </FormControl>
              </div>}
              <div className={classes.buttonBox}>
                <Button
                  className={classes.button}
                  onClick={handleOk}
                  variant="contained"
                  color="primary">
                  Ok
                </Button>
                <Button
                  className={classes.button}
                  onClick={handleClear}
                  variant="outlined"
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

export default repeatTask;
