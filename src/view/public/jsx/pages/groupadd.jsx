import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';

export default class GroupAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: '',
            user: '',
            mygroups: ''
        };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/group`),
            axios.get('/api/auth/currentuser'),
            axios.get(`/api/group/yourgroups`)
        ])
            .then(axios.spread((group, user, mygroups) => {
                this.setState({ groups: group.data, user: user.data, mygroups: mygroups.data });
            })).catch(error => console.log(error));

    }

    render() {

        let GroupDOM = null;
        let flagExistsLoop = null;

        if (this.state.groups.length !== 0) {
            GroupDOM = (
                this.state.groups.map((group) => {

                    return (
                        <tr>
                            <td>{group.group_name}</td>
                            <td>{group.privacy == 0 ? "Public" : "Private"}</td>
                            <td>TO DO</td>
                            <td><a href={'/group/' + group.id}> Go </a></td>
                        </tr>

                    )
                })
            );
        }

        return (
            <div>
                <div className="row">
                    <div className="group col-md-9">
                        <h3> Create a group </h3>
                        <div className='form-group'>

                            <form id="group-create-form" action="/api/group/add" method="post">
                                <label for="groupname">Group Name:</label>
                                <input type="text" className="form-control" id="groupName" name="groupName" />
                                <div className="checkbox">
                                    <label><input type="checkbox" value="true" name="privacy" />Private Group</label>
                                </div>
                                <input className="btn btn-default" type="submit" value="Create" />
                            </form>

                        </div>
                    </div>
                    <div className="imgfloatright col-md-3"><img src="/Images/group-video-chat.png" className="img-responsive" />
                    </div>
                </div>
                <div className="row">
                    <h3> Find a group </h3>
                    <table className="allGroups">
                        <thead>
                            <tr>
                                <th>Group Name</th>
                                <th>Privacy</th>
                                <th>No. of Users</th>
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
