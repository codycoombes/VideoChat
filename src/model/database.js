const config = require('config');
const db = config.get('db_config');
const Sequelize = require('sequelize');

// config database
const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'mysql',
    logging: false
});

// test connection
sequelize.authenticate().then(() => {
    console.log('Connected.');
}).catch(err => {
    console.error('Connection error:', err);
});

// database schema
const User = sequelize.define('user', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    username: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING },
    avatar: { type: Sequelize.STRING, defaultValue: 'default.jpg' },
    desc: { type: Sequelize.TEXT },
    timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    show_groups: { type: Sequelize.INTEGER, defaultValue: '0' } //show groups the user is in on their profile
});

const Genre = sequelize.define('genre', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING }
});

//privacy = 1 for private or 0 for nonprivate
//user_id is the group master
const Group = sequelize.define('group', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    group_name: { type: Sequelize.TEXT },
    privacy: { type: Sequelize.INTEGER }
});

const Video = sequelize.define('video', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: { type: Sequelize.STRING },
    path: { type: Sequelize.STRING },
    stream: { type: Sequelize.STRING },
    icon: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    size: { type: Sequelize.BIGINT },
    count: { type: Sequelize.BIGINT },
    type: { type: Sequelize.STRING },
    genre_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Genre,
            key: 'id'
        }
    },
    group_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Group,
            key: 'id'
        }
    },
    timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const BrowseHistory = sequelize.define('history', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    video_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Video,
            key: 'id'
        }
    },
});

const Comment = sequelize.define('comment', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    video_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Video,
            key: 'id'
        }
    },
    text: { type: Sequelize.TEXT },
    timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const Rating = sequelize.define('rating', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    video_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Video,
            key: 'id'
        }
    },
    rating: { type: Sequelize.INTEGER }
});

const GroupUser = sequelize.define('groupuser', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    group_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Group,
            key: 'id'
        }
    }
});


const GroupInvites = sequelize.define('groupinvites', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: {
        type: Sequelize.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    group_id: {
        type: Sequelize.BIGINT,
        references: {
            model: Group,
            key: 'id'
        }
    }

});


// associations
Comment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
BrowseHistory.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
BrowseHistory.belongsTo(Video, { foreignKey: 'video_id', targetKey: 'id' });
Group.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
GroupInvites.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
GroupInvites.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
GroupUser.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
GroupUser.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
Video.belongsTo(Genre, { foreignKey: 'genre_id', targetKey: 'id' });
Video.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

// synchronize database
sequelize.sync({ force: true }).then(async () => {

    // create initial users
    // test = $2a$10$LcUMJ/G/Vrbvd4RPecqYFegI3enMqnIR.JMIxyRK1uTbs/i2CWqGO
    await User.bulkCreate([
        { id: 1, username: 'admin', password: '$2a$10$LcUMJ/G/Vrbvd4RPecqYFegI3enMqnIR.JMIxyRK1uTbs/i2CWqGO', show_groups: 1 },
        { id: 2, username: 'user1', password: '$2a$10$LcUMJ/G/Vrbvd4RPecqYFegI3enMqnIR.JMIxyRK1uTbs/i2CWqGO', desc:'hello' },
        { id: 3, username: 'user2', password: '$2a$10$LcUMJ/G/Vrbvd4RPecqYFegI3enMqnIR.JMIxyRK1uTbs/i2CWqGO' },
        { id: 4, username: 'user3', password: '$2a$10$LcUMJ/G/Vrbvd4RPecqYFegI3enMqnIR.JMIxyRK1uTbs/i2CWqGO', desc:'I like scifi.', show_groups: 1 }
    ]);

    await Genre.bulkCreate([
        { id: 1, name: 'Comedy' },
        { id: 2, name: 'Horror' },
        { id: 3, name: 'Thriller' },
        { id: 4, name: 'Action' },
        { id: 5, name: 'Animation' },
    ]);

    //create default group that all users will be in
    await Group.bulkCreate([
        { user_id: 1, group_name: 'Default', privacy: 0 },
        { user_id: 2, group_name: 'SFU', privacy: 0 }
    ]);

    await GroupUser.bulkCreate([
        { user_id: 1, group_id: 1 },
        { user_id: 2, group_id: 1 },
        { user_id: 3, group_id: 1 },
        { user_id: 4, group_id: 1 },
        { user_id: 2, group_id: 2 }
    ]);

    // default data
    await Video.bulkCreate([
        { id: 1, title: 'Toy', path: '/video/1.mp4', user_id: 2, stream: '/api/video/1/stream', icon: '/api/video/1/icon', description: 'default mp4', size: 383631, count: 0, type: 'mp4', group_id: 2, genre_id: 1 },
        { id: 2, title: 'Snowden', path: '/video/2.mp4', user_id: 2, stream: '/api/video/2/stream', icon: '/api/video/2/icon', description: 'movie trailer', size: 24701440, count: 0, type: 'mp4', group_id: 1, genre_id: 4 },
        { id: 3,  title: 'animated', path: '/video/3.mp4', user_id: 2, stream: '/api/video/3/stream', icon: '/api/video/3/icon', description: 'snippet', size: 1110140, count: 0, type: 'mp4', group_id: 2, genre_id: 1 },
        { id: 4, title: 'animated2', path: '/video/4.mp4', user_id: 2, stream: '/api/video/4/stream', icon: '/api/video/4/icon', description: 'snippet2', size: 1110140, count: 0, type: 'mp4', group_id: 2, genre_id: 3 },
        { id: 5, title: 'another', path: '/video/5.mp4', user_id: 2, stream: '/api/video/5/stream', icon: '/api/video/5/icon', description: 'snippet3', size: 1110140, count: 0, type: 'mp4', group_id: 2, genre_id: 2 },
        { id: 6, title: 'another2', path: '/video/6.mp4', user_id: 2, stream: '/api/video/6/stream', icon: '/api/video/6/icon', description: 'snippet4', size: 1110140, count: 0, type: 'mp4', group_id: 2, genre_id: 1 },
        { id: 7, title: 'The Imitation Game', path: '/video/7.mp4', user_id: 2, stream: '/api/video/7/stream', icon: '/api/video/7/icon', description: 'Alan Turing', size: 1110140, count: 0, type: 'mp4', group_id: 1, genre_id: 4 },
        { id: 8, title: 'Mr. Robot', path: '/video/8.mp4', user_id: 2, stream: '/api/video/8/stream', icon: '/api/video/8/icon', description: 'Season 3', size: 1110140, count: 0, type: 'mp4', group_id: 1, genre_id: 4 },
        { id: 9, title: 'Silicon Valley', path: '/video/9.mp4', user_id: 2, stream: '/api/video/9/stream', icon: '/api/video/9/icon', description: 'Season 1', size: 1110140, count: 0, type: 'mp4', group_id: 1, genre_id: 1 },

    ]);

    // create initial comments
    await Comment.bulkCreate([
        { user_id: 2, video_id: 9, text: 'nice video' },
        { user_id: 4, video_id: 9, text: 'asafsfjk' },
        { user_id: 2, video_id: 2, text: 'hi' },
        { user_id: 2, video_id: 9, text: '@user3 here is a super long comment that should span multiple lines in the display, blah blah blah uper long comment that should span multiple lines in the display, blah blah blah  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit nibh, euismod non maximus pharetra, condimentum ut metus. Mauris vestibulum tellus tortor, sit amet convallis massa luctus id. Ut id magna in dui fermentum malesuada. Donec posuere vel eros sed mollis. Etiam vel neque sed lacus pulvinar imperdiet. Duis erat velit, dignissim sed arcu nec, tempor rutrum eros. Ut dapibus magna arcu, a pretium metus lobortis eu.' },
    ]);

});

// database class
export default class Database {

    static async createGroup(userId, groupName, privacy) {
        return Group.create({
            user_id: userId,
            group_name: groupName,
            privacy: privacy
        })
    }

    static async getUserWithId(id) {
        return User.findOne({ where: { id: id }, attributes: { exclude: ['password'] } });
    }
    static async getGroup() {
        return Group.findAll();
    }

    static async getGroupWithId(groupId) {
        return Group.findById(groupId);
    }

    static async deleteGroup(groupId) {
        return Group.destroy(groupId);
    }

    static async getGroupInvites(groupId) {
        return GroupInvites.findAll({ where: { group_id: groupId }, include: [Group, { model: User, attributes: { exclude: ['password'] } }] });
    }

    static async removeInvite(groupId, userId) {
        return GroupInvites.destroy({
            where: {
                user_id: userId,
                group_id: groupId
            }
        });
    }

    static async totalInvites(groupId) {
        return GroupInvites.count({
            where: {
                group_id: groupId
            }
        });
    }



    static async getTotalUsers(groupId) {
        return GroupUser.count({
            where: {
                group_id: groupId
            }
        });
    }


    static async getGroupUser(userId) {
        return GroupUser.findAll({
            include: [Group, { model: User, attributes: { exclude: ['password'] } }],
            where: {
                user_id: userId
            }
        })
    }


    // return null if group is not found
    // if group is private, create new row in groupinvites for groupmaster to accept
    static async joinGroup(userId, groupId) {
        // return GroupUser.create({
        //     user_id: userId,
        //     group_id: groupId
        // })
        Group.findById(groupId).then(group => {
            if (group.privacy === 1 && userId !== group.user_id) {
                return GroupInvites.create({
                    user_id: userId,
                    group_id: groupId
                })
            }
            else {
                return GroupUser.create({
                    user_id: userId,
                    group_id: groupId
                })
            }
        })

    }

    // check if user leaving group is the creator
    // if user is creator then delete group and all groupusers connection to group
    static async leaveGroup(userId, groupId) {
        Group.findById(groupId).then(group => {
            if (group.user_id == userId) {
                GroupUser.destroy({
                    where: {
                        group_id: groupId
                    }
                });
                return Group.destroy({
                    where: {
                        id: groupId
                    }
                });
            }

            else {
                return GroupUser.destroy({
                    where: {
                        user_id: userId,
                        group_id: groupId
                    }
                });
            }

        })
    }


    static async removeUser(groupId, userId) {
        return GroupUser.destroy({
            where: {
                user_id: userId,
                group_id: groupId
            }
        })

    }

    static async addUser(groupId, userId) {
        return GroupUser.create({
            user_id: userId,
            group_id: groupId
        })

    }


    //check if user is in group, or otherwise has requested to join the group,
    // or has not tried to join the group at all
    static async checkUserGroupStatus(userId, groupId) {
        var inGroup = 0; // 0=not in group; 1==requested and waiting; 2 ==ingroup already
        var groupUserRes = await GroupUser.findOne({
            where: {
                user_id: userId,
                group_id: groupId
            }
        });
        if (groupUserRes != null) {
            inGroup = 2;
        }
        else {
            var groupInvRes = await GroupInvites.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId
                }
            });
            if (groupInvRes != null) {
                inGroup = 1;
            }
        }

        return inGroup;
    }


    static async getUserProfile(uname) {
        return User.findOne({
            where: {
                username: uname
            },
            attributes: 
                ['id', 'username','desc','avatar', 'show_groups', [sequelize.fn('date_format', sequelize.col('timestamp'), '%Y-%m'), 'member_since']]
            })
    }

    static async updateUserProfile(uid,avatar,description,show) {
        var avatarPath = 'default.jpg';
        if (avatar) {
            avatarPath = uid+'';
        }
        return User.update({avatar: avatarPath, desc: description, show_groups: show},
        {
            where: {
                id: uid
            }
        })
    }

}

export { Comment, User, Video, Group, GroupUser, Genre, Rating, BrowseHistory, sequelize, Sequelize };
