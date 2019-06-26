import React from 'react';
import Drop from '../components/drop.jsx';

export default class Upload extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Drop router={this.props.router} user={this.props.route.user} />
            </div>
        );
    }

}