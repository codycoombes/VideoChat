import express from 'express';
import { User, GroupUser } from '../../model/database';
import bcrypt from 'bcrypt-nodejs';
import passport from 'passport';
import Database from '../../model/database';
import fileUpload from 'express-fileupload';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (user) {
        if (!user) {
            User.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password)
            }).then(async function (user) {
                await GroupUser.create({ user_id: user.id, group_id: 1 });
                passport.authenticate("local", { failureRedirect: "/signup", successRedirect: "/browse" })(req, res, next)
            })
        } else {
            res.send("user exists")
        }
    });
});

router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    successRedirect: '/browse'
}));

router.get("/signout", async (req, res, next) => {
    req.session.destroy();
    res.redirect("/signin");
});

router.get("/currentuser", async (req, res, next) => {
    res.json({
        id: req.user.id,
        name: req.user.username
    });
});

router.get("/user/:username", async(req,res,next) => {
    try {
        let userInfo = await Database.getUserProfile(req.params.username);
        res.json(userInfo);
    } catch (error){
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post("/settings", async(req,res,next) => {
    try {
        var updateAvatar = false;
        if (req.files.avatar) {
            //uploaded a new avatar
            let avatar = req.files.avatar;
            if ((avatar.mimetype=='image/jpeg')||(avatar.mimetype=='image/png')||(avatar.mimetype=='image/gif')) {
                avatar.mv(`${process.cwd()}/avatars/${req.user.id}`, function(err) {
                    if (err) return res.status(500).send(err);
                });
                updateAvatar = true;
            }
            else { res.status(500).send({ error: 'invalid file format' }) };
        }
        var show = 0;
        if (req.body.showGroups) {
            show = 1;
        }
        let userInfo = await Database.updateUserProfile(req.user.id,updateAvatar,req.body.about,show);
        res.redirect("/settings");
    } catch (error){
         res.status(500).send({ error: error.message || error, trace: error.trace || null });
         console.log(error, error.stack);
    }       
});


export default router;