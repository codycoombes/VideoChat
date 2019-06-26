import React from 'react';
import { Button } from 'react-bootstrap';
import request from 'superagent';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

// adapted from https://facebook.github.io/react/tutorial/tutorial.html

class RenderRating extends React.Component {

	render() {
		return (
			<button className="star" onClick={() => this.props.onClick()}>
				{this.props.value}
			</button>
		);
	}
}

export default class RateVideo extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rating: 0, id: null, average: 0 };
	}

	componentDidMount() {
		axios.all([
			axios.get(`/api/rating/${this.props.vidID}`),
			axios.get(`/api/rating/${this.props.vidID}/user`)
		]).then(axios.spread((ratings, user_rating) => {
			this.setState({ rating: user_rating.data.rating, id: user_rating.data.id, average: ratings.data.average });
		}));
	}

	onStarClick(nextValue, prevValue, name) {
		if (this.state.rating === 0) {
			const req = request.post(`/api/rating/addrating`);
			req.field('user_id', this.props.userId);
			req.field('video_id', this.props.vidID);
			req.field('rating', nextValue);
			req.end((error, result) => {
				if (!error) {
					axios.get(`/api/rating/${this.props.vidID}`).then((ratings) => {
						this.setState({ id: result.body.id, average: ratings.data.average });
					});
				}
			});
		}
		else {
			const req = request.post(`/api/rating/${this.state.id}/updaterating`);
			req.field('user_id', this.props.userId);
			req.field('video_id', this.props.vidID);
			req.field('rating', nextValue);
			req.end((error, result) => {
				if (!error) {
					axios.get(`/api/rating/${this.props.vidID}`).then((ratings) => {
						this.setState({ average: ratings.data.average });
					});
				}
			});
		}
		this.setState({ rating: nextValue });
	}

	render() {
		return (
			<div style={{ float: 'right' }}>
				<span> <b>Average Rating:</b> {this.state.average}   <b>Rate Now:</b> </span>
				<span style={{ top: '10px', display: 'inline-block', position: 'relative' }} >
					<StarRatingComponent
						name="rate1"
						starCount={5}
						value={this.state.rating}
						onStarClick={this.onStarClick.bind(this)}
					/>
				</span>
			</div>
		);
	}
}
