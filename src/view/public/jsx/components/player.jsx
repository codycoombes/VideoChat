import React from 'react';
import videojs from 'video.js';

// Read more about Video.js here http://docs.videojs.com/tutorial-player-workflows.html

export default class Player extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.player = videojs('video');
        this.player.src([
            { type: "video/mp4", src: `/api/video/${this.props.id}/stream` },
            { type: "video/webm", src: `/api/video/${this.props.id}/stream` },
            { type: "video/ogg", src: `/api/video/${this.props.id}/stream` }
        ]);
        this.player.play();
    }

    isPlaying() {
        return !this.player.paused();
    }

    volume(value) {
        this.player.volume(value); // accepts 0-1
    }

    playVideo() {
        this.player.play();
    }

    pauseVideo() {
        this.player.pause();
    }

    currentTime() {
        return this.player.currentTime();
    }

    seekTo(time) {
        console.log('seeked: ' + time);
        this.player.currentTime(time);
    }

    render() {
        return (
            <video id="video" className="video-js vjs-16-9" controls preload="auto">
                <p className="vjs-no-js">
                    To view this video please enable JavaScript
                </p>
            </video>
        );
    }
}