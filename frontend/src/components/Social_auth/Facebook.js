
import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import AuthContext from '../../context/auth-context';
import config from '../../config.json';

import FacebookIcon from '@material-ui/icons/Facebook';


class Facebook extends Component {

    // To add access to context data.
    static contextType = AuthContext;

    responseFacebook = response => {
        console.log('response',response,);
        // To create body for POST request for login/sing up.
        let requestBody = {
            query: `
            mutation AuthFacebook($email: String!, $accessToken: String!){
              authFacebook(facebookInput: {email: $email, accessToken: $accessToken}) {
                userId
                token
                tokenExpiration
                email
              }
            }
        `,
            variables: {
                email: response.email,
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
                console.log("facebook res", res);
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            if (resData.data.authFacebook.token) {
                this
                    .context
                    .login(resData.data.authFacebook.token, resData.data.authFacebook.userId, resData.data.authFacebook.tokenExpiration, resData.data.authFacebook.email);
            }
        }).catch(err => {
            console.log(err);
        }); 
    }

    render() {
        return (
            <FacebookLogin
                appId={config.FACEBOOK_APP_ID}
                cssClass ="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-fullWidth"
                // icon={<FacebookIcon/>}
                textButton="Continue with Facebook"
                autoLoad={false}
                fields="name,email"
                callback={this.responseFacebook} />
        );
    }
}

export default Facebook;