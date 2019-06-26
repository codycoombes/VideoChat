import React from 'react';
import ReactDropzone from 'react-dropzone';
import filesize from 'filesize';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from 'react-modal-bootstrap';
import request from 'superagent';
import axios from 'axios';

export default class Drop extends React.Component {
    constructor(props) {
        super(props);
        this.state = { files: [], isOpen: false, groups: [], group: 1, genres: [], genre: 1 };
    }

    componentDidMount() {
        axios.all([
            axios.get(`/api/group/yourgroups`),
            axios.get(`/api/genre`)
        ]).then(axios.spread((groups, genres) => {
            this.setState({ groups: groups.data, genres: genres.data });
        })).catch(error => console.log(error));
    }

    onDrop(files) {
        this.setState({
            files: files,
            title: files[0].name,
            isOpen: true,
            error: undefined
        });
    }

    hideModal() {
        this.refs.comment.value = "";
        this.setState({
            isOpen: false
        });
    };

    saveFiles() {
        if (!this.state.title || 0 === this.state.title.length) {
            return this.setState({ error: 'Invalid title' });
        }
        const req = request.post('/api/video/upload');
        this.state.files.forEach(file => {
            req.field('title', this.state.title);
            if (this.state.description) req.field('description', this.state.description);
            req.field('user_id', this.props.user.id);
            req.field('size', file.size);
            req.field('count', 0);
            req.field('type', file.type.split('/')[1]);
            req.field('genre_id', this.state.genre);
            req.field('group_id', this.state.group);
            req.attach(file.name, file);
        });
        req.end((error) => {
            if (error) {
                console.error(error);
                this.setState({ error: '/api/video/upload unresponsive' });
            } else {
                this.refs.comment.value = "";
                this.setState({ isOpen: false });
                this.props.router.push('/my_video');
            }
        });
    }

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

    render() {
        let modal, error = null;
        if (this.state.error !== undefined) {
            error = (
                <div className="alert alert-danger" role="alert">
                    {this.state.error}
                </div>
            );
        }
        if (this.state.files.length > 0) {
            let file = this.state.files[0];
            modal = (
                <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                    <ModalHeader>
                        <ModalClose onClick={this.hideModal.bind(this)} />
                        <ModalTitle>Upload File</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {error}
                        <form>
                            <div className="form-group">
                                <label for="title">Title:</label>
                                <input className="form-control" id="title" value={this.state.title} onChange={this.titleChange.bind(this)} />
                                <br />
                                <label for="title">Group:</label>
                                <select className="form-control" value={this.state.group} onChange={this.groupChange.bind(this)}>
                                    {this.state.groups.map((group) => {
                                        return (<option value={group.group.id}>{group.group.group_name}</option>)
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
                                <textarea ref="comment" className="form-control" rows="5" id="descriptoin" onChange={this.descriptionChange.bind(this)}></textarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <span className="modal-footer-left">File Size: {filesize(file.size)}</span>
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
            )
        }
        return (
            <div>
                <div className="dropzone">
                    <ReactDropzone accept="video/mp4, video/webm, video/ogg" multiple={false} onDrop={this.onDrop.bind(this)} className="drop">
                        <p className="drop-text">Try dropping some files here, or click to select files to upload.</p>
                    </ReactDropzone>
                </div>
                {modal}
            </div>
        );
    }
}