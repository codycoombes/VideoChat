import React from 'react';
import axios from 'axios';
import moment from 'moment';
import filesize from 'filesize';
import request from 'superagent';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from 'react-modal-bootstrap';

export default class MyVideo extends React.Component {

    constructor() {
        super();
        this.state = { id: null, videos: [], video: null, isOpen: false, groups: [], group: 1, genres: [], genre: 1, title: null, description: null }
    }

    componentDidMount() {
        axios.all([
            axios.get(`/api/group`),
            axios.get(`/api/genre`),
            axios.get(`/api/video/user`)
        ]).then(axios.spread((groups, genres, videos) => {
            let id = -1;
            if (videos.data.length > 0) id = 1;
            this.setState({ id: id, groups: groups.data, genres: genres.data, videos: videos.data });
        })).catch(error => console.log(error));
    }

    handleEdit(id, e) {
        let video;
        this.state.videos.map(function (el) {
            if (el.id === id) video = el;
        });
        this.setState({ video: id, isOpen: true, title: video.title, description: video.description, genre: video.genre_id, group: video.group_id })
    }

    handleDelete(id, e) {
        request.post(`/api/video/${id}/delete`).end((error) => {
            if (error) {
                console.error(error);
            } else {
                axios.get(`/api/video/user`).then((res) => {
                    this.refs.comment.value = "";
                    this.setState({ isOpen: false });
                    this.setState({ videos: res.data });
                });
            }

        });
    }

    hideModal() {
        this.refs.comment.value = "";
        this.setState({
            isOpen: false
        });
    };

    titleChange(event) {
        this.setState({ title: event.target.value });
    }

    groupChange(event) {
        this.setState({ group: event.target.value });
    }

    genreChange(event) {
        this.setState({ genre: event.target.value });
    }

    descriptionChange(event) {
        this.setState({ description: event.target.value });
    }

    saveFiles() {
        // if (!this.state.title || 0 === this.state.title.length) {
        //     return this.setState({ error: 'Invalid title' });
        // }
        const req = request.post(`/api/video/${this.state.video}/edit`);
        req.field('title', this.state.title);
        req.field('description', this.state.description);
        req.field('genre_id', this.state.genre);
        req.field('group_id', this.state.group);
        req.end((error) => {
            if (error) {
                console.error(error);
                // this.setState({ error: '/api/video/upload unresponsive' });
            } else {
                axios.get(`/api/video/user`).then((res) => {
                    this.refs.comment.value = "";
                    this.setState({ isOpen: false });
                    this.setState({ videos: res.data });
                });
            }
        });
    }

    render() {
        let content = null;
        if (this.state.id === -1) {
            content = (
                <div>
                <h1> You haven't uploaded any videos yet! </h1>
                <a href={'/upload/'}><h4>Upload</h4></a>
                                
                </div>);
        } else if (this.state.id !== null) {
            content = (
                <div>
                    {this.state.videos.map((video) => {
                        return (<div className="panel panel-default ">
                            <div className="panel-body">
                                <img rel="thumbnail" src={video.icon} className={"img-responsive img-thumbnail img-article "} />
                                <a href={`/detail/${video.id}`}><h4>{video.title}</h4></a>
                                <span>Description: {video.description}</span><br />
                                <button type="button" className="btn btn-primary myvideo-edit" onClick={this.handleEdit.bind(this, video.id)}>Edit</button>
                                <button type="button" className="btn btn-danger myvideo-edit" onClick={this.handleDelete.bind(this, video.id)}>Delete</button>
                            </div>
                        </div>)
                    })}

                    <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                        <ModalHeader>
                            <ModalClose onClick={this.hideModal.bind(this)} />
                            <ModalTitle>Upload File</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <form>
                                <div className="form-group">
                                    <label for="title">Title:</label>
                                    <input className="form-control" id="title" value={this.state.title} onChange={this.titleChange.bind(this)} />
                                    <br />
                                    <label for="title">Group:</label>
                                    <select className="form-control" value={this.state.group} onChange={this.groupChange.bind(this)}>
                                        {this.state.groups.map((group) => {
                                            return (<option value={group.id}>{group.group_name}</option>)
                                        })}
                                    </select>
                                    <br />
                                    <label for="title">Genre:</label>
                                    <select className="form-control" value={this.state.genre} onChange={this.genreChange.bind(this)}>
                                        {this.state.genres.map((genre) => {
                                            return (<option value={genre.id}>{genre.name}</option>)
                                        })}
                                    </select>
                                    <br />
                                    <label for="title">Description:</label>
                                    <textarea ref="comment" className="form-control" rows="5" id="descriptoin" value={this.state.description} onChange={this.descriptionChange.bind(this)}></textarea>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <span className="modal-footer-right">
                                <button className='btn btn-default' onClick={this.hideModal.bind(this)}>
                                    Close
                                </button>
                                <button className='btn btn-primary' onClick={this.saveFiles.bind(this)}>
                                    Submit
                                </button>
                            </span>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }

        return (
            <div>{content}</div>
        )
    }

}
