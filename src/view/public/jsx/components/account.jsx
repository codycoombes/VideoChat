import React from 'react';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
	}

	handleSignUp(event) {
		event.preventDefault();
		const user = {
			username: this.refs.username.value,
			email: this.refs.email.value,
			password: this.refs.password.value
		};
	}

	render() {
		return (
			<div className="signup">
				<form className="form-signin" method="post" action="/api/auth/signup">
					<h2 className="form-signin-heading">Create Your Account</h2>
					<label for="inputEmail" className="sr-only">Email address</label>
					<input type="test" className="form-control" name="username" placeholder="username" required autofocus />
					<label for="inputPassword" className="sr-only">Password</label>
					<input type="password" id="inputPassword" className="form-control" name="password" placeholder="Password" required />
					<button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
				</form>
			</div>
		);
	}
}