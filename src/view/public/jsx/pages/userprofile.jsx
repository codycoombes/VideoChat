import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            userGroups: []
        };
    }

    componentWillMount() {
        axios.get(`/api/auth/user/${this.props.params.un}`).then((userinfo)=>{
           this.setState({ userInfo: userinfo.data });
           if (userinfo.data.show_groups==1) {
                axios.get(`/api/group/profilegroups/${this.state.userInfo.id}`).then((userg)=>{
                    this.setState({ userGroups: userg.data });
                }).catch(error => console.log(error));
           }
        }).catch(error => console.log(error));
    }

    render() {
        let GroupDOM = null;
        if (this.state.userInfo.show_groups==1) {
            GroupDOM = (
                this.state.userGroups.map((group) => {

                    return (
                            <li><a href={'/group/' + group.group_id}>{group.group.group_name}</a></li>
                    )
                })
            );

        }

        return (
            <div>
            <div>
                <h4> {this.state.userInfo.username}'s Profile 
                { (this.props.route.user.username==this.state.userInfo.username) ? 
                    <span className="profile-edit"> (<a href="/settings">Edit</a>)</span> : ''} </h4>
            </div>
            <div className="row">
                <div className="profile-avatar col-md-3 col-sm-4"><img src={"/avatars/"+this.state.userInfo.avatar} width="150" className="img-rounded" /></div>
                <div className="col-md-9 col-sm-8">
                    <div className="profile-since">Member since: {this.state.userInfo.member_since}</div>
                    <div className="profile-desc">
                    <b>About:</b> {this.state.userInfo.desc}
                </div>
                </div>
            </div>
            { (this.state.userInfo.show_groups==1) && <div className="profile-groups"><b>Groups:</b> 
            <ul>{GroupDOM}</ul></div>}
            </div>
        );
    }

}








