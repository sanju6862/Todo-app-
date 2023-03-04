 
import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import DeleteModal from "../components/Modal/DeleteUserModal";

// Material-UI components (https://material-ui.com/).
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

// Style for Material-UI components
const styles = theme => ({
  root: {
    display: "flex",
    paddingTop: "84px",
    paddingLeft: "220px",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      paddingTop: "1px",
      paddingLeft: "1px"
    }
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing(10)
  },
  paper: {
    padding: theme.spacing(2.5)
  },
  gridWrapper: {
    padding: theme.spacing(3)
  },
  typography: {
    display: "flex",
    alignItems: "center"
  },
  form: {
    maxWidth: "350px"
  },
  button: {
    minWidth: "128px",
    margin: theme.spacing(1)
  },
  formButtons: {
    display: "flex",
    justifyContent: "center"
  }
});

class SettingsPage extends Component {
  state = {
    isLoading: false,
    deleting: false,
    changeEmail: false,
    changePassword: false,
    errorEmail: "",
    errorPassword: "",
    showSuccessMsgs: false,
    successMsgs: "",
  };
  // To add access to context data.
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.newEmailEl = React.createRef();
    this.confEmailEl = React.createRef();
    this.curPasswordEl = React.createRef();
    this.newPasswordEl = React.createRef();
  }

  deleteUser = () => {
    this.setState({ deleting: true });
  };

  closeModal = () => {
    this.setState({ deleting: false });
  };

  changeEmail = () => {
    this.setState({ changeEmail: true, changePassword: false });
  };

  confirmNewEmail = () => {
    const newEmail = this.newEmailEl.current.value;
    const confEmail = this.confEmailEl.current.value;
    const curPassword = this.curPasswordEl.current.value;
    if (newEmail !== confEmail) {
      this.setState({
        errorEmail:
          "Your confirmation email doesn't match your new email. Please try again."
      });
    } else if (newEmail === this.context.email) {
      this.setState({
        errorEmail: "This email address is already registered."
      });
    } else {
      this.setState({ errorEmail: "" });
      // To create body for POST request
      let requestBody = {
        query: `
          mutation ChangeEmail($newEmail: String!, $password: String!) {
            changeEmail(newEmail: $newEmail, password: $password) {
              userId
              token
              tokenExpiration
              email
              }
            }
          `,
        variables: {
          newEmail: newEmail,
          password: curPassword
        }
      };

      const token = this.context.token;

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed ");
          }
          return res.json();
        })
        .then(resData => {
          if (resData.errors) {
            // To handle error message.
            this.setState({ errorEmail: resData.errors[0].message });
          } else {
            this.setState({
              errorEmail: "",
              changeEmail: false,
              successMsgs: "Email successfilly changed!",
              showSuccessMsgs: true
            });
            const token = resData.data.changeEmail.token;
            const userId = resData.data.changeEmail.userId;
            const tokenExpiration = resData.data.changeEmail.tokenExpiration;
            const email = resData.data.changeEmail.email;
            this.context.login(token, userId, tokenExpiration, email);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  confirmNewPassword = () => {
    const curPassword = this.curPasswordEl.current.value;
    const newPassword = this.newPasswordEl.current.value;
    const token = this.context.token;

      // To create body for POST request
      let requestBody = {
        query: `
          mutation ChangePassword($password: String!, $newPassword: String!) {
            changePassword(password: $password, newPassword: $newPassword) {
              msgs
              }
            }
          `,
        variables: {
          password: curPassword,
          newPassword: newPassword,
        }
      };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed ");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          // To handle error message.
          this.setState({ errorPassword: resData.errors[0].message });
        } else {
        this.setState({
          errorPassword: "",
          changePassword: false,
          successMsgs: "Password successfilly changed!",
          showSuccessMsgs: true
        });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  changePassword = () => {
    this.setState({ changeEmail: false, changePassword: true });
  };

  handleCancel = () => {
    this.setState({ changeEmail: false, changePassword: false });
  };

  handleCloseSnackbar = () => {
    this.setState({ successMsgs: "", showSuccessMsgs: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Settings
          </Typography>
          {this.state.isLoading ? (
            <div className={classes.spinner}>
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Profile
              </Typography>
              <div className={classes.gridWrapper}>
                <Grid container direction="row" justify="flex-start">
                  <Grid item xs={12} lg={2} className={classes.typography}>
                    <Typography>Email</Typography>
                  </Grid>
                  <Grid>
                    {this.state.changeEmail ? (
                      <Grid className={classes.form}>
                        {this.state.errorEmail && (
                          <Alert severity="error">
                            {this.state.errorEmail}
                          </Alert>
                        )}
                        <TextField
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                          id="new_email"
                          label="New Email"
                          name="new email"
                          autoComplete="New email"
                          type="email"
                          size="small"
                          inputRef={this.newEmailEl}
                        />
                        <TextField
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                          id="confirm_email"
                          label="Confirm Email"
                          name="comfirm email"
                          autoComplete="Confirm email"
                          type="email"
                          size="small"
                          inputRef={this.confEmailEl}
                        />
                        <TextField
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                          name="password"
                          label="Current Password"
                          type="password"
                          id="current_password"
                          autoComplete="current-password"
                          size="small"
                          inputRef={this.curPasswordEl}
                        />
                        <Grid className={classes.formButtons}>
                          <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={this.confirmNewEmail}
                          >
                            Ok
                          </Button>
                          <Button
                            className={classes.button}
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleCancel}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Typography>{this.context.email}</Typography>
                        <Button
                          color="primary"
                          className={classes.button}
                          onClick={this.changeEmail}
                        >
                          Change
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid container direction="row" justify="flex-start">
                  <Grid item xs={12} lg={2} className={classes.typography}>
                    <Typography>Password</Typography>
                  </Grid>
                  <Grid>
                    {this.state.changePassword ? (
                      <Grid className={classes.form}>
                         {this.state.errorPassword && (
                          <Alert severity="error">
                            {this.state.errorPassword}
                          </Alert>
                        )}
                        <TextField
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                          name="password"
                          label="Current Password"
                          type="password"
                          id="current-password"
                          autoComplete="current-password"
                          size="small"
                          inputRef={this.curPasswordEl}
                        />
                        <TextField
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                          name="password"
                          label="New Password"
                          type="password"
                          id="new_password"
                          autoComplete="new-password"
                          size="small"
                          inputRef={this.newPasswordEl}
                        />
                        <Grid className={classes.formButtons}>
                          <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={this.confirmNewPassword}
                          >
                            Ok
                          </Button>
                          <Button
                            className={classes.button}
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleCancel}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Typography>●●●●●●</Typography>
                        <Button
                          color="primary"
                          className={classes.button}
                          onClick={this.changePassword}
                        >
                          Change
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    onClick={this.deleteUser}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </div>
            </Paper>
          )}
        </Container>
        {this.state.deleting && <DeleteModal onCancel={this.closeModal} />}
        <Snackbar
          open={this.state.showSuccessMsgs}
          autoHideDuration={8000}
          onClose={this.handleCloseSnackbar}
        >
          <Alert
            variant="outlined"
            severity="success"
            onClose={this.handleCloseSnackbar}
          >
            {this.state.successMsgs}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
export default withStyles(styles)(SettingsPage);
