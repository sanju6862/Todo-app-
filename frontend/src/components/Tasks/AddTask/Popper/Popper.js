
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import {ReactComponent as NormalIcon} from './PriorityIcons/normal.svg';
import {ReactComponent as MediumIcon} from './PriorityIcons/medium.svg';
import {ReactComponent as LowIcon} from './PriorityIcons/low.svg';
import {ReactComponent as HighIcon} from './PriorityIcons/high.svg';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  popper: {
    // The popper clipped under the dialog during editing task.
    zIndex: theme.zIndex.modal + 2,
  },
}));

// eslint-disable-next-line react/display-name
const PriorityPopper = React.forwardRef((props, ref) => {
  const [priority,
    setPriority] = React.useState('1');
  const [anchorEl,
    setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(anchorEl ?
            null :
            event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ?
        'simple-popper' :
        undefined;

  const handleChange = (event) => {
    setPriority(event.target.value);
    setAnchorEl(anchorEl ?
            null :
            event.currentTarget);
  };

  let currentIcon;
  switch (priority) {
    case 2:
      currentIcon = <LowIcon/>;
      break;
    case 3:
      currentIcon = <MediumIcon/>;
      break;
    case 4:
      currentIcon = <HighIcon/>;
      break;
    default:
      currentIcon = <NormalIcon/>;
  }
  return (
    <div className="form-control">
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        value={priority}
        ref={ref}>
        {currentIcon}
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} className={classes.popper}>
        <Paper>
          <div className={classes.root}>
            <MenuItem value={1} onClick={handleChange}><NormalIcon/>Normal
            </MenuItem>
            <MenuItem value={2} onClick={handleChange}><LowIcon/>Low</MenuItem>
            <MenuItem value={3} onClick={handleChange}><MediumIcon/>Medium</MenuItem>
            <MenuItem value={4} onClick={handleChange}><HighIcon/>High</MenuItem>
          </div>
        </Paper>
      </Popper>
    </div>
  );
});

export default PriorityPopper;
