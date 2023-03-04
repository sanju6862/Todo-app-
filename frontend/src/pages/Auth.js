 
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../context/auth-context';
import Facebook from '../components/Social_auth/Facebook';
import Google from '../components/Social_auth/Google';
import MyDivider from '../components/Social_auth/Divider';

// Material-UI components (https://material-ui.com/)
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://dariacode.dev/">
                DariaCode
            </Link>{' '} {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// Style for Material-UI components
const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '92vh'
    },
    paper: {
        marginTop: theme.spacing(14),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    facebook: {
        margin: theme.spacing(3, 0, 2),
    },
    switch: {
        alignItems: 'center'
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto'
    }
});

class AuthPage extends Component {
    state = {
        isLogin: true,
        showError: ""
    }

    // To add access to context data.
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            };
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        // The trim() method removes whitespace from both sides of a string
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        // To create body for POST request for login
        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                        email
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        // To create body for POST request for creating a user.
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: {email: $email, password: $password}) {
                            userId
                            token
                            tokenExpiration
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                // To handle error message.
                let showError = res.json();
                showError.then(val => {
                    switch (val.errors[0].message) {
                        case "Password is incorrect":
                            this.setState({showError: "Password is incorrect"})
                            break;
                        case "User does not exist":
                            this.setState({showError: "User does not exist"})
                            break;
                        case "User exists already":
                            this.setState({showError: "User exists already"})
                            break;
                        default:
                            this.setState({showError: ""})
                    }
                    console.log('this state ', this.state.showError);
                    console.log('val of error from res', val.errors[0].message)
                });
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            let token;
            let userId;
            let tokenExpiration;
            let email;
            if (resData.data.login) {
                token = resData.data.login.token;
                userId = resData.data.login.userId;
                tokenExpiration = resData.data.login.tokenExpiration;
                email = resData.data.login.email; 
            } else {
                token = resData.data.createUser.token;
                userId = resData.data.createUser.userId;
                tokenExpiration = resData.data.createUser.tokenExpiration;
                email = resData.data.createUser.email;
            }
            this.context.login(token, userId, tokenExpiration, email);
        }).catch(err => {
            console.log(err);
        });
    };

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
                        <Typography component="h1" variant="h5">
                            {this.state.isLogin
                                ? "Login"
                                : "Signup"}
                        </Typography>
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
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                inputRef={this.passwordEl}/>

                                {this.state.showError &&
                                <Alert 
                                severity="error">
                                {this.state.showError}
                                </Alert>}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                {this.state.isLogin
                                    ? "Login"
                                    : "Signup"}
                            </Button>
                            <MyDivider />
                            <div className={classes.submit}>
                                <Facebook />
                            </div>
                            <div className={classes.submit}>
                                <Google />
                            </div>
                            <Grid container justify="center">
                            <Grid item xs>
                                <Link href="/resetPassword" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid> 
                                <Grid item>
                                    <Link
                                        className={classes.switch}
                                        onClick={this.switchModeHandler}
                                        variant="body">
                                        {this.state.isLogin
                                            ? "Don't have an account? Signup"
                                            : "Already have an account? Login"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
                <footer className={classes.footer}>
                    <Container maxWidth="sm">
                        <Copyright/>
                    </Container>
                </footer>
            </div> 
        );
    }
}

// To apply the styles given above for Material-UI components.
AuthPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AuthPage);