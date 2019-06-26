import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';

export default class GroupInvite extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupname: null,
            groupinvites: null
        };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/group/groupinvites/${this.props.params.id}`),
            axios.get(`/api/group/${this.props.params.id}`)
        ])
            .then(axios.spread((invite, group) => {
                this.setState({ groupinvites: invite.data, groupname: group.data.group_name });
            })).catch(error => console.log(error));
    }


    render() {

        let VideoDOM = null;
        let InviteDOM = null;
        let GroupName = null;
        let PrivacyType = null;
        let Privacy = null;
        let joinDOM = null;
        let totalUsers = 0;
        let groupinvites = 0;

        if (this.state.groupname !== null) {
            GroupName = this.state.groupname;
        }

        if (this.state.groupinvites !== null) {
            InviteDOM = this.state.groupinvites.map((groupinvite) => {
                return (
                    <tr>
                        <td> {groupinvite.user.username} </td>
                        <td>
                            <form action={"/api/group/adduser/" + this.props.params.id + "/" + groupinvite.user_id} method="post">
                                <input type="submit" value="Accept" />
                            </form>
                        </td>
                        <td>
                            <form action={"/api/group/decline/" + this.props.params.id + "/" + groupinvite.user_id} method="post">
                                <input type="submit" value="Decline" />
                            </form>
                        </td>
                    </tr>
                )
            });
        }


        return (

            <div className="row">
                <h1> {GroupName} </h1>
                <h3> Requests to join group: </h3>
                <table className="allInvites">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {InviteDOM}
                    </tbody>
                </table>
            </div>
        );
    }

}