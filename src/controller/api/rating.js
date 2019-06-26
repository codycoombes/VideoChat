import express from 'express';
import Rating from '../../model/rating';

const router = express.Router();

router.post('/addrating', async (req, res) => {

    try {
        let u_rating = await Rating.createRating(req.user.id, req.body.video_id, req.body.rating);
        res.success(u_rating);

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:videoId', async (req, res) => {

    try {
        let u_rating = await Rating.getAverageRating(req.params.videoId);
        res.success(u_rating);

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }

});

router.get('/:videoId/user', async (req, res) => {


    try {
        let u_rating = await Rating.getRating(req.user.id, req.params.videoId);
        (u_rating) ? res.success(u_rating) : res.status(404).send();

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }

});

router.post('/:id/updaterating', async (req, res) => {

    try {
        let u_rating = await Rating.updateRating(req.params.id, req.body);
        (u_rating) ? res.success(u_rating) : res.status(404).send();

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }

});

export default router;
