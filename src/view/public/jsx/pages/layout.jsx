import React from 'react';
import WebNav from '../components/navbar.jsx';

export default class Layout extends React.Component {
    constructor() {
        super();
    }
    render() {


        return (
            <div>
                <WebNav uname={this.props.route.user} />


                <div className="container">
                    {this.props.children}
                </div>



            </div>
        );
    }
}
