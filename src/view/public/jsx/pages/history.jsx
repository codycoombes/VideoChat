import React from 'react';
import axios from 'axios';
import moment from 'moment';

export default class BrowseHistory extends React.Component {

    constructor() {
        super();
        this.state = { history: [] }
    }

    componentDidMount() {
        axios.get(`/api/history/user`).then((res) => {
            this.setState({ history: res.data })
        });
    }

    render() {

        if (this.state.history.length === 0) {
            return (
                <div>
                <h1> You haven't checked out any videos yet! </h1>
                <a href={'/browse/'}><h4>Browse Videos</h4></a>
                </div>);
        }

        else {
            return (
                <div>
                    {this.state.history.map((el) => {
                        return (<div className="panel panel-default ">
                            <div className="panel-body">
                                <img rel="thumbnail" src={el.video.icon} className={"img-responsive img-thumbnail img-article "} />
                                <a href={`/detail/${el.video.id}`}><h4>{el.video.title}</h4></a>
                                <span>
                                    {moment(el.createdAt).fromNow()} <br />
                                    Owner: {el.user.username} <br />
                                    Description: {el.video.description}
                                </span>
                            </div>
                        </div>)
                    })}
                </div>
            );
        }
    }

}
