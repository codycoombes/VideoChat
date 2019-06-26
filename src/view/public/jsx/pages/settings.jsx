import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            descValue: '',
            isChecked: ''
        };
    }

    componentWillMount() {
        axios.get(`/api/auth/user/${this.props.route.user.username}`).then((userinfo)=>{
           var checked = false;
           if (userinfo.data.show_groups==1) {
              checked = true;
           }
           this.setState({ userInfo: userinfo.data, descValue: userinfo.data.desc, isChecked: checked });
        }).catch(error => console.log(error));
    }

    handleChange(event) {
       this.setState({descValue: event.target.value});
    }

    handleCheck(event) {
       this.setState({isChecked: event.target.checked});
    }

    render() {
        return (
            <div>
            <div>
                <h1> Settings </h1>
            </div>
            <div>
            <h3>Profile</h3>
            <div className='form-group'>

            <form ref="settings-form" id="settings-form" action="/api/auth/settings" method="post" encType="multipart/form-data">
              <div className="profile-avatar"><img src={"/avatars/"+this.state.userInfo.avatar} width="150" className="img-rounded" /></div>
              <input type="file" name="avatar" />
              <div className="settings-about">
              <label for="about">About:</label>
              <textarea className="form-control" rows="3" name="about" value={this.state.descValue} onChange={this.handleChange.bind(this)}></textarea>
              </div>
               <div className="checkbox">
                 <label><input type="checkbox" value="true" name="showGroups" checked={this.state.isChecked} onChange={this.handleCheck.bind(this)} />Display my groups</label>
               </div>
              <input className="btn btn-default" type="submit" value="Update"/>
            </form>

            </div>
            </div>
            </div>
        );
    }

}








