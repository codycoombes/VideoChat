import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';

export default class GroupDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupinfo: null,
            videos: [],
            status: '',
            totalusers: null,
            groupinvites: [],
            currentUserId: null,
            masterId: null,
            masterName: null

        };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/video/group/${this.props.params.id}`),
            axios.get(`/api/group/${this.props.params.id}`),
            axios.get(`/api/group/status/${this.props.params.id}`),
            axios.get(`/api/group/totalusers/${this.props.params.id}`),
            axios.get(`/api/group/groupinvites/${this.props.params.id}`),
            axios.get(`/api/auth/currentuser`),
            axios.get(`/api/group/groupmaster/${this.props.params.id}`)
        ])
            .then(axios.spread((vid, group, status, total, invite, user, master) => {
                this.setState({ videos: vid.data, groupinfo: group.data, status: status.data, totalusers: total.data, groupinvites: invite.data, currentUserId: user.data.id, masterId: master.data.id, masterName: master.data.username });
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



        if (this.state.groupinfo !== null) {
            GroupName = this.state.groupinfo.group_name;
            PrivacyType = this.state.groupinfo.privacy;

            if (PrivacyType == 1) {
                Privacy = 'PRIVATE';
            }
            else {
                Privacy = 'PUBLIC';
            }
        }

        if (this.state.totalusers !== null) {
            totalUsers = this.state.totalusers;
        }

        if (this.state.status.status == 2) {
            if (this.state.videos !== null) {
                VideoDOM = (
                    this.state.videos.map((video) => {
                        return (
                            <div className="panel panel-default ">
                                <div className="panel-body">
                                    <img rel="thumbnail" src={video.icon} className={"img-responsive img-thumbnail img-article "} />
                                    <a href={`/detail/${video.id}`}><h4>{video.title}</h4></a>
                                </div>
                            </div>
                        );
                    })
                )
            }

            if (this.state.videos == null || this.state.videos.length == 0 || this.state.videos == []) {
                VideoDOM = (
                    <h3> This group has no videos yet! </h3>
                )
            }
        }

        else {
            VideoDOM = (
                <h3> Must join group before viewing videos! </h3>
            )
        }

        if (this.state.status.status == 0) {
            if (PrivacyType == 1) {
                joinDOM = (
                    <form action={"/api/group/join/" + this.props.params.id} method="post">
                        <input type="submit" className="btn btn-info groupbtn" value="Request to join" />
                    </form>
                );
            }
            else {
                joinDOM = (
                    <form action={"/api/group/join/" + this.props.params.id} method="post">
                        <input type="submit" className="btn btn-info groupbtn" value="Join group" />
                    </form>
                );
            }
        }

        else if (this.state.status.status == 1) {
            joinDOM = (
                <input type="submit" className="btn btn-info groupbtn disabled" value="Already requested" />
            );
        }
        else {
            if (this.state.masterId != this.state.currentUserId) {
                joinDOM = (
                    <form action={"/api/group/leave/" + this.props.params.id} method="post">
                        <input type="submit" className="btn btn-danger groupbtn" value="Leave group" />
                    </form>
                );
            }
            else {
                joinDOM = (
                    <form action={"/api/group/leave/" + this.props.params.id} method="post">
                        <input type="submit" className="btn btn-danger groupbtn" value="Delete Group" />
                    </form>
                );
            }
        }

        if (this.state.groupinvites.length > 0 && this.state.masterId == this.state.currentUserId) {
            InviteDOM = (
                <form action={`/group/invite/${this.props.params.id}`}>
                    <input type="submit" className="btn btn-info groupbtn" value="New Requests" />
                </form>
            );

        }

        else if (this.state.masterId == this.state.currentUserId) {
            InviteDOM = (
                <input type="submit" className="btn btn-info groupbtn disabled" value="No Requests" />
            );
        }


        return (
            <div><div className="group-title">
                <h1> {GroupName} </h1></div>
                <div className="join-btn">{joinDOM}</div>
                <br /><br />
                <div className="join-btn">{InviteDOM}</div>
                <p> Group Master: {this.state.masterName} </p>
                <p> Privacy: {Privacy} </p>
                <p> No. of Users: {totalUsers} </p>
                <br /><br />
                {VideoDOM}
            </div>
        );
    }

}
