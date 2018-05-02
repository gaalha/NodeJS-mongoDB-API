let personController = require('./controllers/api/personController');

module.exports = (app) => {
    app.use('/api/person',          personController);
}

