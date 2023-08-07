const express = require('express');
const hosterControllers = require(`${__dirname}/../controllers/hoster`);

const hosterRouter = express.Router();

hosterRouter.route('/:id/:token')
    .get(hosterControllers.getHoster)
    .post(hosterControllers.createHoster)
    .patch(hosterControllers.updateHoster)
    .delete(hosterControllers.deleteHoster);

module.exports = hosterRouter;