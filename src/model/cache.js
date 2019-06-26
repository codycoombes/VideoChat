import nodeCache from 'node-cache';

let cache = new nodeCache({ checkperiod: 1800 }); // recycle cache every 30 minutes

async function setCache(variable, value) {
    cache.set(variable, value);
}

async function getCache(variable) {
    return new Promise((resolve, reject) => {
        cache.get(variable, function (error, value) {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
        });
    });
}

export { setCache, getCache };