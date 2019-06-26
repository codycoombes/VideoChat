import {Rating} from './database';

export default class Ratings {

	static async createRating(userID, videoID, rating) {

		return new Promise(async (resolve, reject) => {

			let ratingDone = await Rating.create({ user_id: userID, video_id: videoID, rating: rating }).catch((error) => { reject(error) });
			resolve(ratingDone);

		});
	}

	static async getAverageRating(videoID) {

		return new Promise(async (resolve, reject) => {

			let u_rating = await Rating.findAll({ where: { video_id: videoID } }).catch((error) => { reject(error) });
			let total = 0;
			let length = u_rating.length;
			u_rating.forEach((item) => {
				total += item.rating;
			});
			let average = total / length;

			resolve({
				average: (average) ? average : 0,
				rating: u_rating
			});
		});

	}

	static async getRating(userID, videoID) {

		return new Promise(async (resolve, reject) => {

			let u_rating = await Rating.findOne({ where: { user_id: userID, video_id: videoID } }).catch((error) => { reject(error) });
			resolve(u_rating);
		});

	}

	static async updateRating(id, post) {

		return new Promise(async (resolve, reject) => {
			let rate = await Rating.findById(id);
			let u_rating = await rate.update(post).catch((error) => { reject(error) });
			resolve(u_rating);
		});
	}


}
