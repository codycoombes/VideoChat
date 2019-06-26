import { Genre } from './database';

export default class VideoGenre {
    static async getGenre() {
        return new Promise(async (resolve, reject) => {
            let genre = await Genre.findAll().catch((error) => { reject(error) });
            resolve(genre);
        });
    }

    static async getGenreWithId(id) {
        return new Promise(async (resolve, reject) => {
            let genre = await Genre.findById(id).catch((error) => { reject(error) });
            resolve(genre);
        });
    }
}