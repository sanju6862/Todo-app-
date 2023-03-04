
import React from 'react';

// Material-UI components (https://material-ui.com/)
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import LoopIcon from '@material-ui/icons/Loop';
import {green, yellow} from '@material-ui/core/colors';

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(0.3),
    marginBottom: theme.spacing(0.3),
    flexGrow: 1,
    // minWidth: '100%',
  },
  repeat: {
    padding: theme.spacing(0.1),
  },
  list: {
    padding: theme.spacing(0),
  },
  menuIcon: {
    margin: theme.spacing(0, 1.5, 0, 0),
  },
}));

// eslint-disable-next-line require-jsdoc
export default function TaskItem(props) {
  const [anchorEl,
    setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const priority = props.priority;

  let currentIcon;
  switch (priority) {
    case 2:
      currentIcon = <RadioButtonUncheckedIcon style={{color: green[500]}} />;
      break;
    case 3:
      currentIcon = <RadioButtonUncheckedIcon style={{color: yellow[500]}} />;
      break;
    case 4:
      currentIcon = <RadioButtonUncheckedIcon color="secondary" />;
      break;
    default:
      currentIcon = <RadioButtonUncheckedIcon color="action" />;
  };

  // To change dates to local time zone.
  const options = {
    // weekday: 'short',
    // year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formatedDate = new Date(props.date).toLocaleDateString('en', options);

  return (
    <ListItem key={props.taskId} className={classes.list}>
      <Card className={classes.root} variant="outlined">
        <div>
          <IconButton
            onClick={props
                .onComplete
                .bind(this, props.taskId)}>
            {props.complete ?
              <CheckCircleIcon
                style={{color: green[500]}} /> :
              currentIcon}
          </IconButton>
          <Typography
            display='inline'>
            {props.title}
          </Typography>
        </div>
        <div>
          {props.repeat !== null?
             <IconButton
               disabled>
               <LoopIcon
                 className={classes.repeat}
                 color="action"
                 fontSize="small" />
             </IconButton>: ''}
          {props.date !== null ?
          <Typography
            display='inline'>
            {formatedDate}
          </Typography> :''}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}>
            <MoreVertIcon/>
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 46 * 4.5,
                width: '15ch',
              },
            }}>
            <MenuItem
              key="edit"
              onClick={props
                  .onEdit
                  .bind(this, props.taskId)}>
              <EditOutlinedIcon
                className={classes.menuIcon}
                color="action"/>
            Edit
            </MenuItem>
            <MenuItem
              key="delete"
              onClick={props
                  .onDelete
                  .bind(this, props.taskId)}>
              <DeleteOutlineIcon
                className={classes.menuIcon}
                color="action"/>
            Delete
            </MenuItem>
          </Menu>
        </div>
      </Card>
    </ListItem>
  );
};
