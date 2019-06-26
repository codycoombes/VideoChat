import express from 'express';
import Genre from '../../model/genre';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let genre = await Genre.getGenre();
        res.success(genre);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let genre = await Genre.getGenreWithId(req.params.id);
        res.success(genre);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

export default router;