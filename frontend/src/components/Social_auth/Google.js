
import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import AuthContext from '../../context/auth-context';
import config from '../../config.json';

import Button from '@material-ui/core/Button';

class Google extends Component {

    // To add access to context data.
    static contextType = AuthContext;

    onFailure = (error) => {
      alert(error);
    };

    googleResponse = response => {
        console.log('response',response,);
        // To create body for POST request for login/sing up.
        let requestBody = {
            query: `
            mutation AuthGoogle($email: String!, $accessToken: String!){
              authGoogle(googleInput: {email: $email, accessToken: $accessToken}) {
                userId
                token
                tokenExpiration
                email
              }
            }
        `,
            variables: {
                email: response.Ut.Eu,
                accessToken: response.accessToken
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
                // To handle error message.
                console.log("google res", res);
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
             if (resData.data.authGoogle.token) {
                this
                    .context
                    .login(resData.data.authGoogle.token, resData.data.authGoogle.userId, resData.data.authGoogle.tokenExpiration, resData.data.authGoogle.email);
            } 
        }).catch(err => {
            console.log(err);
        }); 
    }

    render() {
        return (
            <GoogleLogin
              clientId={config.GOOGLE_CLIENT_ID}
              render={renderProps => (
                <Button 
                fullWidth
                variant="outlined"
                color="primary"
                onClick={renderProps.onClick} 
                disabled={renderProps.disabled}>CONTINUE WITH GOOGLE</Button>
              )}
              // className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-fullWidth"
              disabledStyle
              icon={true}
              onSuccess={this.googleResponse}
              onFailure={this.onFailure} />
        );
    }
}

export default Google;