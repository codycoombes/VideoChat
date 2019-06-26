import express from 'express';
import Group from '../../model/database';
import GroupUser from '../../model/database';
import GroupInvites from '../../model/database';
import User from '../../model/database';
import Database from '../../model/database';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let group = await Group.getGroup();
        res.success(group);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/yourgroups', async (req, res) => {
    try {
        let id = req.user.id;
        let group = await GroupUser.getGroupUser(id);
        res.success(group);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});


router.post('/add', async (req, res) => {
    try {
        if (req.body.privacy) {
            var priv = 1;
        }
        else {
            var priv = 0;
        }
        let group = await Group.createGroup(req.user.id, req.body.groupName, priv);
        let groupuser = await GroupUser.joinGroup(req.user.id, group.id);
        res.redirect('/group/' + group.id);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/leave/:id', async (req, res) => {
    try {
        let groupid = req.params.id;
        let groupuser = await GroupUser.leaveGroup(req.user.id, groupid);
        res.redirect('/group');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let group = await Group.getGroupWithId(id);
        res.success(group);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});


router.post('/adduser/:groupid/:userid', async (req, res) => {
    try {
        let groupid = req.params.groupid;
        let userid = req.params.userid;
        let adduser = await GroupUser.addUser(groupid, userid);
        let removeinvite = await GroupInvites.removeInvite(groupid, userid);
        let totalinvites = await GroupInvites.totalInvites(groupid);
        if (totalinvites != 0) {
            res.redirect('/group/invite/' + groupid);
        }
        else {
            res.redirect('/group/' + groupid);
        }
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/decline/:groupid/:userid', async (req, res) => {
    try {
        let groupid = req.params.groupid;
        let userid = req.params.userid;
        let removeinvite = await GroupInvites.removeInvite(groupid, userid);
        res.redirect('/group/invite/' + groupid);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});



router.post('/join/:id', async (req, res) => {
    try {
        let userid = req.user.id;
        let groupid = req.params.id;
        let group = await GroupUser.joinGroup(userid, groupid);
        res.redirect('/group/' + groupid);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/request/:id', async (req, res) => {
    try {
        let userid = req.user.id;
        let groupid = req.params.id;
        let group = await Database.requestInvite(groupid, userid);
        res.redirect('/group/' + groupid);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/leave/:id', async (req, res) => {
    try {
        let userid = req.user.id;
        let groupid = req.params.id;
        let group = await GroupUser.leaveGroup(userid, groupid);
        res.redirect('/group/' + groupid);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/status/:id', async (req, res) => {
    try {
        let userid = req.user.id;
        let joinStatus = await Database.checkUserGroupStatus(userid, req.params.id);
        res.json({ status: joinStatus });
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/totalusers/:id', async (req, res) => {
    try {
        let groupid = req.params.id;
        let totalusers = await GroupUser.getTotalUsers(groupid);
        res.success(totalusers);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/groupinvites/:id', async (req, res) => {
    try {
        let groupid = req.params.id;
        let groupinvites = await GroupUser.getGroupInvites(groupid);
        res.success(groupinvites);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/groupmaster/:id', async (req, res) => {
    try {
        let groupid = req.params.id;
        let group = await Group.getGroupWithId(groupid);
        let groupmaster = await User.getUserWithId(group.user_id);
        res.success(groupmaster);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/profilegroups/:uid', async (req, res) => {
    try {
        let id = req.params.uid;
        let group = await GroupUser.getGroupUser(id);
        res.success(group);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

export default router;
