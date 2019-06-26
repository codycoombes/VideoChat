import express from 'express';
import BrowseHistory from '../../model/history';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let history = await BrowseHistory.getHistory();
        res.success(history);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/user', async (req, res) => {
    try {
        let history = await BrowseHistory.getHistoryWithUserId(req.user.id);
        res.success(history);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/:id', async (req, res, next) => {
    try {
        await BrowseHistory.setHistory(req.params.id, req.user.id);
        res.send('success');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

export default router;