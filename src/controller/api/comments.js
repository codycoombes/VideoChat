import express from 'express';
import { User, Comment, sequelize, Sequelize } from '../../model/database';

const router = express.Router();

router.get('/:videoid',
	function (req, res) {
		Comment.findAll({
			where: [{ video_id: req.params.videoid }],
			include: [{ model: User, attributes: ['username'] }],
			order: [['timestamp', 'DESC']]
		}).then(comments => { res.render('pages/comments', { user: req.user, videoid: req.params.videoid, allcomments: comments }); });
	});

router.post('/submit',
	function (req, res) {
		//console.log(req.body.userid);
		//console.log(req.body.commenttext);
		Comment.create({
			user_id: req.user.id,
			video_id: req.body.videoid,
			text: req.body.commenttext
		}).then(() => { res.send(req.body.videoid); });
	});


router.post('/delete',
	function (req, res) {
		//console.log(req.body.commentid);
		Comment.destroy({
			where: {
				id: req.body.commentid,
			}
		}).then(() => { res.send(req.body.videoid); });
	});

export default router;