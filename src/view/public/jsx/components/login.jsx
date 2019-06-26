import React from 'react';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		const user = {
			username: this.refs.username.value,
			email: this.refs.email.value,
			password: this.refs.password.value
		};

		this.props.login(user);
	}

	render() {
		return (
			<div className="login">
				<form onSubmit={this.handleLogIn.bind(this)}>
					<h1>Log In</h1>
					<input type="text" placeholder="Username" ref="username" />
					<input type="email" placeholder="E-Mail" ref="email" />
					<input type="password" placeholder="Password" ref="password" />
					<input type="submit" value="Log In" />
				</form>
			</div>
		);
	}
}