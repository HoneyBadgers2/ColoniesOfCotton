import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import Auth from './Auth.js';
import Lobby from './lobby.jsx'; 

const auth = new Auth();

class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin () {
        auth.login();
    }

    render() {
        if(localStorage.getItem('email')) {
            return (<div><Lobby/></div>)
        } 
        return (
            <div className='LandingPage'> 
                <div className='Position'>                
                    <img src='../../PNGs/ColoniesFestival!.png' />
                    <button onClick={ this.handleLogin } className='Login'>Login</button>
                </div>
            </div>

        )
    }
}


export default LandingPage;