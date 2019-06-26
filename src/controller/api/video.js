import express from 'express';
import Video from '../../model/video';
import GroupUser from '../../model/database';
import BrowseHistory from '../../model/history';
import Genre from '../../model/genre';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let id = req.params.id;
        let video = await Video.getVideo();
        res.success(video);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/user', async (req, res, next) => {
    try {
        let video = await Video.getVideoWithUserId(req.user.id);
        res.success(video);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/user/recommended', async (req, res, next) => {
    try {
        let id = req.params.id;
        let videos = await Video.getVideo();
        let groups = await GroupUser.getGroupUser(req.user.id);
        let genres = await Genre.getGenre();
        let histories = await BrowseHistory.getHistoryWithUserId(req.user.id);
        let authVideos = [];
        let priority = [];
        let result = [];

        groups.forEach((group) => {
            videos.forEach((video) => {
                if (group.group_id === video.group_id) {
                    authVideos.push(video);
                }
            });
        });

        genres.forEach((genre) => {
            priority.push(genre.name);
        });

        histories.forEach((history) => {
            priority.push((genres[history.video.genre_id - 1].name))
        });

        function sortByFrequency(array) {
            let frequency = {};

            array.forEach(function (value) { frequency[value] = 0; });

            let uniques = array.filter(function (value) {
                return ++frequency[value] == 1;
            });

            return uniques.sort(function (a, b) {
                return frequency[b] - frequency[a];
            });
        }

        priority = sortByFrequency(priority);

        authVideos.sort(function (a, b) {
            return priority.indexOf(a.genre.name) - priority.indexOf(b.genre.name);
        });


        res.success(authVideos.slice(0, 5));

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/group/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let video = await Video.getGroupVideos(id);
        res.success(video);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/upload', async (req, res, next) => {
    try {
        if (!req.files) return res.status(400).send('No files were uploaded.');
        await Video.setVideo(req.files[Object.keys(req.files)[0]], req.body);
        res.send('File uploaded!');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.use('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let video = await Video.getVideoWithId(id);
        let groups = await GroupUser.getGroupUser(req.user.id);
        let auth = false;

        groups.forEach((group) => {
            if (group.group_id === (video && video.group_id)) {
                auth = true;
            }
        });

        // user access is forbidden
        return (auth) ? next() : res.status(403).send();

    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let video = await Video.getVideoWithId(id);
        res.success(video);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:id/stream', async (req, res, next) => {
    try {
        let id = req.params.id;
        let range = req.headers.range;
        let [readStream, response] = await Video.streamVideo(id, range, res);
        readStream.pipe(response);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.get('/:id/icon', async (req, res, next) => {
    try {
        let id = req.params.id;
        let thumbnail = await Video.icon(id);
        res.set('Content-Type', 'image/png');
        res.set('Content-Length', thumbnail.length);
        res.send(thumbnail);
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/:id/edit', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Video.updateVideo(id, req.body);
        res.send('File uploaded!');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/:id/delete', async (req, res, next) => {
    try {
        await Video.deleteVideo(req.params.id);
        res.send('success');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

router.post('/:id/count', async (req, res, next) => {
    try {
        await Video.setVideoCount(req.params.id);
        res.send('success');
    } catch (error) {
        res.status(500).send({ error: error.message || error, trace: error.trace || null });
        console.log(error, error.stack);
    }
});

export default router;