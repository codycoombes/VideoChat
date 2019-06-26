import React from 'react';

export default class SignIn extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <form className="form-signin" method="post" action="/api/auth/signin">
                    <h2 className="form-signin-heading">Please sign in</h2>
                    <label for="inputEmail" className="sr-only">Email address</label>
                    <input type="test" className="form-control" name="username" placeholder="username" required autofocus />
                    <label for="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" className="form-control" name="password" placeholder="Password" required />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <a href="/signup"> Dont have an account? </a>
                </form>
            </div>
        );
    }

}