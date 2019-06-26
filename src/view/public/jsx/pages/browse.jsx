import React from 'react';
import BrowseContent from '../components/browsecontent.jsx';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class Browse extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <BrowseContent />
            </div>
        );
    }

}
