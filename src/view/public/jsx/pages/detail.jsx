import React from 'react';
import WebNav from '../components/navbar.jsx';
import axios from 'axios';

export default class Detail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            videoinfo: '',
            comments: '',
            commentHeader: '',
            user: '',
            genre: '',
            uploader: '',
            id: null
        };
    }

    componentDidUpdate() {
        const script = document.createElement("script");
        script.type = 'text/javascript';
        script.src = "/js/comment.js";
        script.async = true;
        document.body.appendChild(script);
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/video/${this.props.params.id}`),
            axios.get(`/api/comments/${this.props.params.id}`),
            axios.get('/api/auth/currentuser')
        ])
            .then(axios.spread((vid, com, user) => {
                var commentResponse = $('<div/>').append(com.data);
                var commentHeader = $(commentResponse).find("#comment-title").parent().html();
                var allComments = $(commentResponse).find("#comments").parent().html();
                this.setState({ id: vid.data.id, videoinfo: vid.data, comments: allComments, commentHeader: commentHeader, user: user.data, uploader: vid.data.user.username, genre: vid.data.genre.name });
            })).catch(error => {
                console.log(error);
                this.setState({ id: -1 });
            });

    }

    render() {

        let content = null;

        if (this.state.id === -1) {
            content = (
                <h1>You do not have permission to access this page</h1>
            )
        } else if (this.state.id !== null) {
            content = (
                <div>
                    <div className="row mw">
                        <div className="col-md-6 col-sm-3"><img src={"/api/video/" + this.props.params.id + "/icon"} className="img-responsive" /></div>
                        <div className="col-md-6 col-sm-9 video-info">
                            <h4>{this.state.videoinfo.title}</h4><br />
                            <p>Uploaded by: {this.state.uploader}<br />
                                Genre: {(this.state.genre != null) ? this.state.genre : "N/A"}<br />
                                Published on: {this.state.videoinfo.timestamp}<br />
                                Description: {this.state.videoinfo.description}</p><p>
                                <a href={'/video/' + this.props.params.id}><button type="button" className="btn btn-default btn-lg room-btn">Enter room</button></a></p></div>
                    </div>
                    <div className="row"><div className="col-md-4"></div></div>

                    <div className="comment-module">
                        <div className="row centered comment-entry-section">
                            <div className="col-12">
                                <div dangerouslySetInnerHTML={{ __html: this.state.commentHeader }} />
                                <div className='form-group'>
                                    <form id="comment-form" action="" method="post">
                                        <input type="hidden" name="userid" value={this.state.user.id} />
                                        <input type="hidden" name="videoid" value={this.props.params.id} />
                                        <textarea className="form-control" rows="2" name="commenttext"></textarea>
                                        <input className="btn btn-default" type="submit" value="Comment" />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="row centered" id="displaycomments" dangerouslySetInnerHTML={{ __html: this.state.comments }}>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>{content}</div>
        );
    }

}
