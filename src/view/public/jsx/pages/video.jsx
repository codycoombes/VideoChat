import React from 'react';
import Player from '../components/player.jsx';
import Chat from '../components/chat.jsx';
import request from 'superagent';
import RateVideo from '../components/ratevideo.jsx'

export default class Video extends React.Component {

    constructor() {
        super();
        this.state = { id: null }
    }

    componentDidMount() {
        request.get(`/api/video/${this.props.params.id}`).end((error, result) => {
            if (error) {
                this.setState({ id: -1 });
            } else {
                this.setState({ id: result.body.id });
                request.post(`/api/video/${this.props.params.id}/count`).end();
                request.post(`/api/history/${this.props.params.id}`).end();
            }

        });
    }

    videoOut() {
        this.refs.Chat.syncVideoOut(this.refs.Player);
    }

    videoIn(spec) {
        var videoSpec = JSON.parse(spec);
        if (videoSpec.timestamp > 0) {
            this.refs.Player.seekTo(videoSpec.timestamp);
        }
        var shouldPlay = videoSpec.playing
        console.log("spec?", videoSpec);
        console.log("shouldPlay?", shouldPlay);
        if (shouldPlay) {
            this.refs.Player.playVideo();
        } else {
            this.refs.Player.pauseVideo();
        }
    }

    render() {
        let chat = (<Chat ref="Chat" callback={this.videoIn.bind(this)} room={this.props.params.id} />);
        let content = null;
        let style = {
            visibility: 'hidden'
        }

        if (this.state.id === -1) {
            content = (
                <h1>You do not have permission to access this page</h1>
            )
        } else if (this.state.id !== null) {
            style = {
                visibility: 'visible'
            }
            content = (
                <div className="col-md-8">
                    <Player ref="Player" id={this.props.params.id} /> <br />
                    <button style={{ float: 'left' }} className="btn btn-default btn-responsive" onClick={this.videoOut.bind(this)}>sync</button>
                    <div className="rating-comp">
                        <RateVideo userId={this.props.route.user.id} vidID={this.props.params.id} />
                    </div>
                </div>
            )
        }

        return (
            <div>
                <div className="row">
                    {content}
                    <div style={style} className="col-md-4"><Chat ref="Chat" callback={this.videoIn.bind(this)} room={this.props.params.id} /></div>
                </div>
            </div>
        );
    }

}
