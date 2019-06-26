import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';
import { Button, ButtonToolbar } from 'react-bootstrap';
import BrowseContent from '../components/browsecontent.jsx';

export default class Group extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: []
        };
    }

    componentWillMount() {
        axios.get('/api/group/yourgroups').then((group) => {
            this.setState({ groups: group.data });
        }).catch(error => console.log(error));
    }

    render() {

        let GroupDOM = null;

        if (this.state.groups.length !== 0) {
            GroupDOM = (
                this.state.groups.map((group) => {
                    return (
                        <tr>
                            <td> {group.group.group_name} </td>
                            <td>{group.group.privacy == 0 ? "Public" : "Private"}</td>
                            <td> <a href={'/group/' + group.group.id}> Go </a></td>
                        </tr>
                    )
                })
            );
        }

        return (

            <div>
                <h1> My Groups: </h1>
                <div className="row">
                    <table className="allGroups">
                        <thead>
                            <tr>
                                <th>Group Name</th>
                                <th>Privacy</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {GroupDOM}
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }

}

