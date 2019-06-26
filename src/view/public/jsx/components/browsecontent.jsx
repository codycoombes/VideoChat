import React from 'react';
import axios from 'axios';

export default class BrowseContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { videos: [], groups: [], recommended: [] };
	}

	componentDidMount() {
		axios.all([
			axios.get(`/api/video/`),
			axios.get(`/api/group/yourgroups`),
			axios.get(`/api/video/user/recommended`)
		])
			.then(axios.spread((vid, groups, recommended) => {
				this.setState({ videos: vid.data, groups: groups.data, recommended: recommended.data });
			})).catch(error => console.log(error));
	}

	render() {

		return (
			<div id='container'>
				<div id='videos'>
					{this.state.groups.map((group) => {
						let videos = this.state.videos.map((video, index) => {
							if (group.group_id === video.group_id) {
								return (
									<div className="panel panel-default floated_img">
										<div className="panel-body">
											<a href={`/detail/${video.id}`}>
												<img rel="thumbnail" src={video.icon} className={"img-responsive img-thumbnail img-article "} />
												<h4>{video.title}</h4>
											</a>
										</div>
									</div>
								)
							}
						});
						let check = (item) => { return item !== undefined };
						if (videos.filter(check).length !== 0) {
							return (
								<div id='videos'>
									<a href={"/group/" + group.group_id} ><h2>{group.group.group_name}</h2></a>
									{videos}
								</div>
							)
						}
					})}
				</div>
				<div id='mightlike'>
					<h2> Recommended Videos: </h2>
					{this.state.recommended.map((video) => {
						return (
							<div className="panel panel-default floated_img">
								<div className="panel-body">
									<a href={`/detail/${video.id}`}>
										<img rel="thumbnail" src={video.icon} className={"img-responsive img-thumbnail img-article "} />
										<h4>{video.title}</h4>
									</a>
								</div>
							</div>
						)
					})}
				</div>

			</div>
		);
	}
}
