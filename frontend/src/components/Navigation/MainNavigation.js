

import React from 'react';
import AuthContext from '../../context/auth-context';
import Sidebar from '../Sidebar/Sidebar';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

const drawerWidth = 260;

// Style for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
    // The drawer clipped under the app bar
      zIndex: theme.zIndex.drawer + 1,
      position: 'fixed',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  loginButton: {
    textTransform: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      // width: drawerWidth,
      flexShrink: 0,
    },
  },
  // Necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

// eslint-disable-next-line require-jsdoc
export default function MainNavigation(props) {
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div className={classes.root}>
            <CssBaseline />
            <AppBar position="static" className={classes.appBar}>
              <Toolbar>
                {context.token && (<IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>)}
                <Typography variant="h6" className={classes.title}>
            Todo app
                </Typography>
                {!context.token &&
                (<Button
                  color="inherit"
                  className={classes.loginButton}>
                  Login
                </Button>)}
                {context.token &&
                (<Button
                  color="inherit"
                  className={classes.loginButton}
                  onClick={context.logout}>
                    Logout
                </Button>)}
              </Toolbar>
            </AppBar>
            {context.token &&
            (<nav className={classes.drawer} aria-label="tasks folders">
              <Hidden mdUp implementation="css">
                <Drawer
                  container={container}
                  variant="temporary"
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                >
                  {<Sidebar />}
                </Drawer>
              </Hidden>
              <Hidden smDown implementation="css">
                <Drawer
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  variant="permanent"
                  open
                >
                  {<div>
                    <div className={classes.toolbar} />
                    <Sidebar />
                  </div>}
                </Drawer>
              </Hidden>
            </nav>)}
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
};
