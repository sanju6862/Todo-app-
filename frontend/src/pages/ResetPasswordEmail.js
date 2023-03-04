 
import React, {Component} from 'react';
import { Link } from 'react-router-dom';

// Material-UI components (https://material-ui.com/)
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Style for Material-UI components
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '92vh',
  },
  paper: {
    marginTop: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  text: {
    paddingTop: theme.spacing(5.5),
    paddingBottom: theme.spacing(5.5)
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  }
});

class ResetPasswordEmailPage extends Component {
  state = {
    isSent: false,
    email: '',
    showError: '',
}
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
}

submitHandler = (event) => {
  event.preventDefault();
  const email = this.emailEl.current.value;

  // The trim() method removes whitespace from both sides of a string
  if (email.trim().length === 0) {
    return;
  }
  const requestBody = {
    query: `
      mutation ResetPasswordEmail($email: String!) {
        resetPasswordEmail(resetPasswordInput: {email: $email}) {
              msgs
            }
        }
    `,
    variables: {
        email: email,
    }
};
fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed');
          } else {return res.json();}
        }).then(resData => {
          console.log(resData);
          if(resData.errors){
            // To handle error message.
            this.setState({isSent: false, showError: resData.errors[0].message});
          } else {
            this.setState({isSent: true, email: email});
          }
        }).catch(err => {
          console.log(err);
      });
}

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline/>
        <Container component="main" maxWidth="xs">
          {/* component="main"- default is "div" */}
          <div className={classes.paper}>
            {/* CHANGE THE AVATAR FOR THE LOGO ICON!!! */}
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            {!this.state.isSent?
            <form className={classes.form} onSubmit={this.submitHandler}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                inputRef={this.emailEl}/>
              {this.state.showError &&
                <Alert severity="error">
                {this.state.showError}
                </Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Reset Password
              </Button>
              <Button 
            variant="outlined" 
            color="primary"
            fullWidth >
              <Link className={classes.link} to='/'>Go to Homepage</Link>
            </Button>
            </form>:
          <div>
          <Typography 
            component="h2" 
            variant="h5" 
            color="primary" 
            className={classes.text}
            gutterBottom>
            An email with further instructions has been sent to {this.state.email}. Please check.
            </Typography>
            <Button 
            variant="outlined" 
            color="primary"
            fullWidth 
            className={classes.submit}>
              <Link className={classes.link} to='/'>Go to Homepage</Link>
            </Button>
          </div>}
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(ResetPasswordEmailPage);
