import React from 'react';
import WelcomeScreen from '../components/welcomescreen.jsx'

export default class Welcome extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                {this.props.children}
                <WelcomeScreen user={this.props.route.user} />
            </div>
        );
    }

}
