import React from 'react'
import auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import { Redirect } from 'react-router'
import createHistory from 'history/createBrowserHistory'

const history = createHistory({ forceRefresh: true })

const AuthLock = new Auth0Lock (
    '98FmkgSB8sTW3vMPk6JSSneB9z3ns1xT',
    'miken619.auth0.com',{
        auth: {
            redirectUrl: 'https://murmuring-hollows-40420.herokuapp.com/',
            responseType: 'token id_token',
            params: {
                scope: 'openid email'
            }
        }
    }
);

class Auth {
    constructor() {
   
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
  

        AuthLock.on("authenticated", function(authResult) {
            // Use the token in authResult to getUserInfo() and save it to localStorage
            AuthLock.getUserInfo(authResult.accessToken, function(error, profile) {
                if (error) {
                    console.log(error)
                    return;
                }
             
            });
            let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            localStorage.setItem('email', authResult.idTokenPayload.email);
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);
            history.push('/');         
        });
        
       
    }
 

    login() {
        AuthLock.show();
    }

    handleAuthentication(authResult, profile) {

        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult, profile);
            } else if (err) {
                console.log(err);
            }
        });
    }


  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route

  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}


export default Auth
