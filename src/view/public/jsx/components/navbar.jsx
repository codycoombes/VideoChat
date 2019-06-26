import React from 'react';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

export default class WebNav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<Navbar>
				<Navbar.Header>
					<Navbar.Brand>
					{this.props.uname == null &&
						<a id="navbar-title" href="/"> VideoChat </a> }
					{this.props.uname != null &&
						<a id="navbar-title" href="/browse"> VideoChat </a> }
					</Navbar.Brand>

				</Navbar.Header>
				{this.props.uname != null &&
					<Nav>
						<NavItem id="navbar-text" eventKey={1} href="/browse"> Browse </NavItem>
						<NavItem id="navbar-text" eventKey={2} href="/upload"> Upload </NavItem>
						<NavItem id="navbar-text" eventkey={3} href="/my_video"> My Videos </NavItem>
						<NavDropdown id="navbar-text" eventKey="4" title="Groups">
							<MenuItem eventKey="4.1" href="/group">My Groups</MenuItem>
							<MenuItem eventKey="4.2" href="/group/add">Create/Find Group</MenuItem>
						</NavDropdown>
						<NavItem id="navbar-text" eventkey={5} href="/history"> History </NavItem>
					</Nav>}
				<Nav pullRight>
					{this.props.uname == null &&
						<NavItem id="navbar-text" eventKey={1} href="/signin">Sign In</NavItem>}
					{this.props.uname != null &&
						<Nav>
						<NavItem id="navbar-text" eventKey={6} href={"/profile/"+this.props.uname.username}>{this.props.uname.username}</NavItem>
						<NavItem id="navbar-text" eventKey={1} href="/api/auth/signout">Sign Out</NavItem></Nav>}

				</Nav>
			</Navbar>
		);
	}
}
