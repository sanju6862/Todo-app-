
import React, { Component } from "react";
import AuthContext from "../../context/auth-context";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

// Style for Material-UI components
const styles = theme => ({
  action: {
    justifyContent: "flex-start",
    padding: theme.spacing(2, 3, 3, 3)
  },
  button: {}
});

// eslint-disable-next-line require-jsdoc
class DeleteModal extends Component {
  state = {
    showError: "",
    checkOne: false,
    checkTwo: false
  };
  // To add access to context data.
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
  }

  checkBoxOneHandler = () => {
    this.state.checkOne
      ? this.setState({ checkOne: false })
      : this.setState({ checkOne: true });
  };

  checkBoxTwoHandler = () => {
    this.state.checkTwo
      ? this.setState({ checkTwo: false })
      : this.setState({ checkTwo: true });
  };

  confirmHandler = () => {
    const email = this.emailEl.current.value;
    if (email !== this.context.email) {
      this.setState({ showError: "Email is incorrect" });
    } else {
      this.setState({ showError: "" });
      // To create body for POST request for login
      let requestBody = {
        query: `
          mutation DeleteUser($userId: ID!) {
            deleteUser(userId: $userId) {
              msgs
              }
            }
          `,
        variables: {
          userId: this.context.userId
        }
      };

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed ");
          }
          return res.json();
        })
        .then(resData => {
          this.context.logout();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog open fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete account</DialogTitle>
        <DialogContent>
          <Typography color="secondary">
            Warning: Deleting account will remove all your data!
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Please confirm the current email."
            name="email"
            autoComplete="email"
            type="email"
            inputRef={this.emailEl}
          />
          {this.state.showError && (
            <Alert severity="error">{this.state.showError}</Alert>
          )}
          <Grid container direction="row" justify="flex-start">
            <Checkbox
              color="primary"
              onChange={this.checkBoxOneHandler}
              name="checkedOne"
            />
            <p>I am aware that deleting account will remove all my data.</p>
          </Grid>
          <Grid container direction="row" justify="flex-start">
            <Checkbox
              color="primary"
              onChange={this.checkBoxTwoHandler}
              name="checkedTwo"
            />
            <p>I am sure I want to delete my account.</p>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.action}>
          {this.state.checkOne && this.state.checkTwo ? (
            <Button
              onClick={this.confirmHandler}
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          ) : (
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled
            >
              Confirm
            </Button>
          )}
          <Button
            onClick={this.props.onCancel}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DeleteModal);
