const crypto = require('crypto');

const getHexMd5 = (text) => {   
    return crypto.createHash('md5').update(text).digest('hex');
}

const getSessionId = (text) => {
    const dateNow = new Date();
    return getHexMd5(`${text}${(dateNow).getHours()}${(dateNow).getDay()}${(dateNow).getMilliseconds()}${(dateNow).getSeconds()}${(dateNow).getMinutes()}`);
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

const getKeyActivate = () => {
    let keyActivate = `000000${Number.parseInt(getRandom(0, 999999))}`;
    //console.log('keyActivate', keyActivate);
    return keyActivate.substring(keyActivate.length - 6);
}

module.exports = {
    getHexMd5,
    getKeyActivate,
    getRandom,
    getSessionId
}