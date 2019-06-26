import fs from 'fs';
import videoScreen from 'video-screen';
import {Video, Comment, BrowseHistory, Genre, User, Sequelize} from './database';

export default class Videos {

    static async getVideo() {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findAll({ include: [Genre, { model: User, attributes: { exclude: ['password'] } }] }).catch((error) => { reject(error) });
            resolve(video);
        });
    }

    static async getVideoWithId(id) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findOne({ where: { id: id }, include: [Genre, { model: User, attributes: { exclude: ['password'] } }] }).catch((error) => { reject(error) });
            resolve(video);
        });
    }

    static async getGroupVideos(id) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findAll({where: {group_id: id}}).catch((error) => { reject(error) });
            resolve(video);
        });
    }

    static async getVideoWithUserId(id) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findAll({ where: { user_id: id } }).catch((error) => { reject(error) });
            resolve(video);
        });
    }

    static async streamVideo(id, range, res) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findOne({ where: { id: id }, include: [Genre, { model: User, attributes: { exclude: ['password'] } }] }).catch((error) => { reject(error) });
            let music = process.cwd() + video.path;

            var stat = fs.statSync(music);
            var readStream;

            if (range !== undefined) {
                var parts = range.replace(/bytes=/, "").split("-");

                var partial_start = parts[0];
                var partial_end = parts[1];

                var start = parseInt(partial_start, 10);
                var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
                var content_length = (end - start) + 1;

                res.status(206).header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': content_length,
                    'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
                });

                readStream = fs.createReadStream(music, { start: start, end: end });
            } else {
                res.header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });
                readStream = fs.createReadStream(music);
            }
            resolve([readStream, res]);
        });
    }

    static async icon(id) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findOne({ where: { id: id }, include: [Genre, { model: User, attributes: { exclude: ['password'] } }] }).catch((error) => { reject(error) });
            videoScreen(process.cwd() + video.path, {
                width: 560,
                height: 320
            }, function (error, screenshot) {
                if (error) reject(error);
                resolve(screenshot);
            });
        });
    }

    static async setVideo(file, post) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.create(post).catch((error) => { reject(error) });
            file.mv(`${process.cwd()}/video/${video.get('id')}.${post.type}`, async function (error) {
                if (error) return reject(error);
                await video.update({
                    path: `/video/${video.get('id')}.${post.type}`,
                    stream: `/api/video/${video.get('id')}/stream`,
                    icon: `/api/video/${video.get('id')}/icon`
                }).catch((error) => { reject(error) });
                resolve();
            });
        });
    }

    static async updateVideo(id, post) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.findById(id);
            let result = await video.update(post).catch((error) => { reject(error) });
            resolve(result);
        });
    }

    static async deleteVideo(id) {
        return new Promise(async (resolve, reject) => {
            await Comment.destroy({ where: { video_id: id } });
            await BrowseHistory.destroy({ where: { video_id: id } });
            let video = await Video.destroy({ where: { id: id } }).catch((error) => { reject(error) });
            resolve(video);
        });
    }

    static async setVideoCount(id) {
        return new Promise(async (resolve, reject) => {
            let video = await Video.update({ count: Sequelize.literal('count + 1') }, { where: { id: id } }).catch((error) => { reject(error) });
            resolve(video);
        });
    }

}