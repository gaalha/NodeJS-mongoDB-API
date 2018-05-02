const express = require('express');
const router = express.Router();
const Person = require('../../models/person');

router.post('/save-person', (req, res, next) => {
    req.checkBody('txtFirstName').trim().notEmpty();
    req.checkBody('txtLastName').trim().notEmpty();
    //req.checkBody('txtFullName').trim().notEmpty();
    req.checkBody('txtEmail').trim().notEmpty();
    req.checkBody('txtDepartment').trim().notEmpty();
    req.checkBody('txtDui').trim().notEmpty();
    req.checkBody('txtNit').trim().notEmpty();
    req.checkBody('txtCellphone').trim().notEmpty();
    req.checkBody('txtTelephone').trim().notEmpty();
    req.checkBody('txtBirthDate').trim().notEmpty();
    req.checkBody('txtGender').trim().notEmpty();
    req.checkBody('txtLenguages').trim().notEmpty();
    req.checkBody('txtAddress').trim().notEmpty();
    req.checkBody('txtEmergencyContact').trim().notEmpty();
    req.checkBody('txtLicenceNumber').trim().notEmpty();
    req.checkBody('txtHireOn').trim().notEmpty();

    let errors = req.validationErrors();
    if(errors) {
        res.send({
            success: false,
            message: 'Existen errores en los datos.',
            error: errors
        });
    }else{
        let id = req.body.txtIdHidden;
        let firstName = req.body.txtFirstName;
        let lastName = req.body.txtLastName;
        let fullName = req.body.txtFirstName + ' ' + req.body.txtLastName;
        let email = req.body.txtEmail;
        let department = req.body.txtDepartment;
        let dui = req.body.txtDui;
        let nit = req.body.txtNit;
        let cellphone = req.body.txtCellphone;
        let telephone = req.body.txtTelephone;
        let birthDate = req.body.txtBirthDate;
        let gender = req.body.txtGender;
        let lenguages = req.body.txtLenguages;
        let address = req.body.txtAddress;
        let emergencyContact = req.body.txtEmergencyContact;
        let licenceNumber = req.body.txtLicenceNumber;
        let hireOn = req.body.txtHireOn;

        let person = new Person({
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            email: email,
            department: department,
            dui: dui,
            nit: nit,
            cellphone: cellphone,
            telephone: telephone,
            birthDate: birthDate,
            gender: gender,
            lenguages: lenguages,
            address: address,
            emergencyContact: emergencyContact,
            licenceNumber: licenceNumber,
            hireOn: hireOn
        });

        if(id !== null && id !== undefined && id !== 0 && id !== '') {
            //console.log(id);
            person._id = id;

            Person.findById(id, (err, result) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Error al actualizar',
                        data: err
                    });
                }else{
                    result.firstName = firstName,
                    result.lastName = lastName,
                    result.fullName = fullName,
                    result.email = email,
                    result.department = department,
                    result.dui = dui,
                    result.nit = nit,
                    result.cellphone = cellphone,
                    result.telephone = telephone,
                    result.birthDate = birthDate,
                    result.gender = gender,
                    result.lenguages = lenguages,
                    result.address = address,
                    result.emergencyContact = emergencyContact,
                    result.licenceNumber = licenceNumber,
                    result.hireOn = hireOn

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
                                data: person
                            });
                        }
                    });
                }
            });
        }else{
            person.save((err) => {
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
                        data: person
                    });
                }
            });
        }
    }
});

router.get('/get-persons', (req, res, next) => {
    Person.find({}, 'firstName lastName fullName email department dui nit cellphone telephone birthDate gender lenguages address emergencyContact licenceNumber hireOn')
    .exec((err, personList) =>{
        if(err){
            res.send({
                success: false,
                message: 'Error al obtener el listado de personas',
                data: err
            });
        }else{
            res.send({data: personList});
        }
    });
});

router.delete('/delete-person/:id', (req, res, next) => {
    let id = req.params.id;

    if(id !== null && id !== undefined){
        Person.findByIdAndRemove(id, (err) => {
            if(err){
                res.send({
                    success:false,
                    message: 'Errror al eliminar.'
                });
            }else{
                res.send({
                    success:true,
                    message: 'Registro Eliminado'
                });
            }
        });
    }

});

/*
router.get('/person-detail/:id', (req, res, next) => {
    let id = req.params.id;
    User.findById(id).exec((err, user) => {
        if(err){
            return next(err);
        }
        res.send({
            success: true,
            data: user
        });
    });
});
*/
module.exports = router;