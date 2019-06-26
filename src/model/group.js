import database from './database';

export default class Group {

    static async getGroup() {
        return new Promise(async (resolve, reject) => {
            let group = await database.getGroup().catch((error) => { reject(error) });
            resolve(group);
        });
    }

    static async getGroupUser(userId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.getGroupUser(userid).catch((error) => { reject(error) });
            resolve(group);
        });
    }


    static async getGroupWithId(groupId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.getGroupWithId(groupId).catch((error) => { reject(error) });
            resolve(group);
        });
    }

    static async createGroup(userId, groupName, privacy) {
        return new Promise(async (resolve, reject) => {
            let group = await database.createGroup(userId, groupName, privacy).catch((error) => { reject(error) });
            resolve();
        });
    }

    static async joinGroup(userId, groupId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.joinGroup(userId, groupId).catch((error) => { reject(error) });
            resolve();
        });
    }

    static async leaveGroup(userId, groupId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.leaveGroup(userId, groupId).catch((error) => { reject(error) });
            resolve();
        });
    }


    static async getUser() {
        return new Promise(async (resolve, reject) => {
            let users = await database.getUser().catch((error) => { reject(error) });
            resolve(users);
        });
    }

    // Only allow deleteGroup if userId is owner of that group
    static async deleteGroup(groupId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.deleteGroup(groupId).catch((error) => { reject(error) });
            resolve();
        });
    }

    // Only allow group master to invite users to a private group
    // userId is the user that the master wishes to invite
    static async inviteUser(groupId, userId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.deleteGroup(groupId, userId).catch((error) => { reject(error) });
            resolve();
        });
    }

    // Only allow group master to kick users
    // userId is the user who the master wishes to kick
    static async removeUser(groupId, userId) {
        return new Promise(async (resolve, reject) => {
            let group = await database.removeUser(groupId, userId).catch((error) => { reject(error) });
            resolve();
        });
    }

    static async getGroupVideos(groupId) {
        return new Promise(async (resolve, reject) => {
            let groupvideos = await database.getGroupVideos(groupId).catch((error) => { reject(error) });
            resolve(groupvideos);
        });
    }

    static async getGroupInvites(groupId) {
        return new Promise(async (resolve, reject) => {
            let groupinvites = await database.getGroupInvites(groupId).catch((error) => { reject(error) });
            resolve(groupinvites);
        });
    }


}

