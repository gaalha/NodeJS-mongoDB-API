let personController = require('./controllers/api/personController');
let todoController = require('./controllers/api/todoController')

module.exports = (app) => {
    app.use('/api/person',          personController);
    app.use('/api/todo',            todoController);
}
