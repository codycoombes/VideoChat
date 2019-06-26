import { BrowseHistory, User, Video } from './database';

export default class VideoGenre {
    static async getHistory() {
        return new Promise(async (resolve, reject) => {
            let history = await BrowseHistory.findAll({ include: [Video, User] }).catch((error) => { reject(error) });
            resolve(history);
        });
    }

    static async getHistoryWithUserId(id) {
        return new Promise(async (resolve, reject) => {
            let history = await BrowseHistory.findAll({ include: [Video, User], where: { user_id: id } }).catch((error) => { reject(error) });
            resolve(history);
        });
    }

    static async setHistory(video_id, user_id) {
        return new Promise(async (resolve, reject) => {
            let history = await BrowseHistory.create({ video_id: video_id, user_id: user_id });
            resolve(history);
        });
    }
}