import express from 'express';
import Video from './api/video';
import Comments from './api/comments';
import Group from './api/group';
import Genre from './api/genre';
import Rating from './api/rating';
import BrowseHistory from './api/history';
import Auth from './api/auth';

const router = express.Router();

router.use('/auth', Auth);

router.use('/', async (req, res, next) => {
    // no current user
    if (!req.user) return res.status(403).send();

    // Convert objects
    res.success = (model) => {
        let results = null;
        if (model instanceof Array) {
            results = model.map((entry) => entry.toJSON ? entry.toJSON() : entry);
        } else {
            results = model.toJSON ? model.toJSON() : model
        }

        res.set('Content-Type', 'application/json')
            .status(200)
            .send(JSON.stringify(results, null, 2));
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return next();
});

router.use('/video', Video);

router.use('/comments', Comments);

router.use('/group', Group);

router.use('/rating', Rating);

router.use('/genre', Genre);

router.use('/history', BrowseHistory);

export default router;
