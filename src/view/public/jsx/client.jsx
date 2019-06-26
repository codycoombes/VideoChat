import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './pages/layout.jsx';
import Welcome from './pages/welcome.jsx';
import Browse from './pages/browse.jsx';
import BrowseHistory from './pages/history.jsx';
import MyVideos from './pages/myvideo.jsx';
import Video from './pages/video.jsx';
import Upload from './pages/upload.jsx';
import Signup from './pages/signup.jsx';
import Signin from './pages/signin.jsx';
import Detail from './pages/detail.jsx';
import Group from './pages/group.jsx';
import GroupDetail from './pages/groupdetail.jsx';
import GroupAdd from './pages/groupadd.jsx';
import UserProfile from './pages/userprofile.jsx';
import Settings from './pages/settings.jsx';
import NotFound from './pages/notfound.jsx';
import GroupInvite from './pages/groupinvite.jsx';

const app = document.getElementById('app');

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" user={__react_user} component={Layout}>
            <IndexRoute user={__react_user} component={Welcome}></IndexRoute>
            <Route path="detail/:id" component={Detail}> </Route>
            <Route path="browse" component={Browse}> </Route>
            <Route path="video/:id" user={__react_user} component={Video}  > </Route>
            <Route path="upload" user={__react_user} component={Upload}> </Route>
            <Route path="signup" component={Signup}> </Route>
            <Route path="signin" component={Signin}> </Route>
            <Route path="group" component={Group}> </Route>
            <Route path="group/add" component={GroupAdd}> </Route>
            <Route path="history" user={__react_user} component={BrowseHistory}> </Route>
            <Route path="my_video" user={__react_user} component={MyVideos}> </Route>
            <Route path="group/:id" component={GroupDetail}> </Route>
            <Route path="profile/:un" user={__react_user} component={UserProfile}> </Route>
            <Route path="settings" user={__react_user} component={Settings}> </Route>
            <Route path="group/invite/:id" component={GroupInvite}> </Route>
            <Route path="*" component={NotFound}> </Route>
        </Route>

    </Router>
    , app);
