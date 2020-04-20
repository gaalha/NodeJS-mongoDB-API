const express = require('express');
const router = express.Router();
const Todo = require('../../models/todo');

router.post('/save', (req, res, next) => {
    console.log(req.body.title)
    console.log(req.body.description)
    console.log(req.body.completed)


    req.checkBody('title').trim().notEmpty();
    req.checkBody('description').trim().notEmpty();
    req.checkBody('completed').trim().notEmpty();

    let errors = req.validationErrors();
    if(errors) {
        res.send({
            success: false,
            message: 'Existen errores en los datos.',
            error: errors
        });
    }else{
        let id = req.body.id;
        let title = req.body.title;
        let description = req.body.description;
        let completed = req.body.completed;

        let todo = new Todo({
            id,
            title,
            description,
            completed
        });

        if(id !== null && id !== undefined && id !== 0 && id !== '') {
            todo._id = id;

            Todo.findById(id, (err, result) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Error al actualizar',
                        data: err
                    });
                }else{
                    result.title = title,
                    result.description = description,
                    result.completed = completed

                    result.save((err) => {
                        if(err) {
                            res.send({
                                success: false,
                                message: 'Error al actualizar.',
                                data: err
                            });
                        }else{
                            res.send({
                                success: true,
                                message: 'Actualizado con exito',
                                data: todo
                            });
                        }
                    });
                }
            });
        }else{
            todo.save((err) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Error al guardar',
                        data: err
                    });
                }else{
                    res.send({
                        success: true,
                        message: 'Almacenado con exito',
                        data: todo
                    });
                }
            });
        }
    }
});

router.get('/get', (req, res, next) => {
    Todo.find({}, 'title description completed')
    .exec((err, todoList) =>{
        if(err){
            res.send({
                success: false,
                message: 'Error al obtener el listado de todos',
                data: err
            });
        }else{
            res.send({
                success: true,
                message: 'Listado de todos',
                data: todoList
            });
        }
    });
});

module.exports = router;