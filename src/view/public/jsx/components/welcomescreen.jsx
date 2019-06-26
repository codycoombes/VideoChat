import React from 'react';
import { Button } from 'react-bootstrap';

export default class WebNav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3> Welcome. </h3>
                <br />
                <br />
                <img className="welcome_logo" src="/Images/black-logo.png" width="400" />
                <br />
                <br />
                {this.props.user === null &&
                    <div>
                        <Button className="welcome_button" bsStyle="primary" href="/signup"> Create Account </Button>
                        <Button className="welcome_button" bsStyle="primary" href="/signin"> Sign In </Button>
                    </div>
                }

            </div>
        );
    }
}
