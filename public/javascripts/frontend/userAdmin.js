let gridButtons = "";
let gridStatus = "";
let table;

$(document).ready(() => {
    prepareButtons();
    initGrid();
});

function prepareButtons(){
    gridStatus = $("#gridStatus").val();
    let bodyButtons = $("#gridButtons").val();
    let tags = $("<div/>");
    tags.append(bodyButtons);

    $("#btnNewUser").click(() => {
        showDialog() 
    });

    gridButtons = "<center>"+tags.html()+"<center>";
}

function bindButtons(){
    $('#userGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.preventDefault) event.preventDefault();
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var obj = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='edit'){ showDialog(obj._id); }
        else if(action=='delete'){ deleteRecord(obj._id); }
    });
}

function drawRowNumbers(selector,table){
    if(typeof(table)=='undefined') return;

    let info = table.page.info();
    let index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,obj){
        if($(obj).hasClass('dataTables_empty')) return;
        $(obj).addClass('text-center').html(index++);
    });
}

function initGrid(){
    table = $('#userGrid')
        .on('draw.dt',function(e,settings,json,xhr){
            setTimeout(function() {bindButtons();},500);
            drawRowNumbers('#userGrid', table);
        }).DataTable({
        language: {
            url: '../languages/dataTables.es.lang'
        },
        ajax: '/api/user/get',
        aoColumns: [
            {data: '_id', sortable: false, searchable:false},
            {data: 'name'},
            {data: 'userName'},
            {
                sortable:false, searchable:false,
                render: function(data,type,row,meta) {
                    return gridButtons.replace("{data}", Base64.encode(JSON.stringify(row)));
                }
            }
        ]
    });
    $('#userGrid').removeClass('display').addClass('table table-bordered table-hover dataTable');
}

function showDialog(_id){
    let isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? 'MODIFICAR USUARIO' : 'AGREGAR USUARIO'),
        message: $("#userFormBody").val(),
        className:"modalSmall"
    });   
    startValidation();

    if(isEditing){
        $("#txtIdHidden").val(_id);
        loadData(_id);
    }
}


function loadData(_id){
    var form = $("#userForm");
    var name= $('#txtName');
    var userName= $('#txtUsername');
    var password= $('#txtPassword');
    $.ajax({
        url: '/api/user/user-detail/' + _id,
        type:'GET',
        success:(data) => {
            console.log(data);
            if(data.success == true){
                name.val(data.data.name);
                userName.val(data.data.userName);
                password.val(data.data.password);
            }
        }});
}

function startValidation(){
    $('#userForm').validate({
        rules: {
            txtName: {
                required:true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtUsername: {
                required:true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtPassword: {
                required: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            txtName: {
                required: 'El campo nombre es requerido',
                minlength: 'El minimo de caracteres es de 2',
                maxlength: 'El maximo de caracteres es de 40'
            },
            txtUsername: {
                required: 'El campo usuario es requerido',
                minlength: 'El minimo de caracteres es de 2',
                maxlength: 'El maximo de caracteres es de 40'
            },
            txtPassword: {
                required: 'El campo contraseña es requerido',
                minlength: 'El minimo de caracteres es de 8',
                maxlength: 'El maximo de caracteres es de 20'
            }
        },
        submitHandler: function(form) {
            save();
        }
    });
}


function save(){
    let form = $("#userForm");
    let data = form.serialize();
    $.ajax({
        url: '/api/user/save',
        type: 'POST',
        data: data,
        success: function(data) {
            humane.log(data.message);
            if(data.success==true){
                table.ajax.reload();
                dialog.modal('hide');
            }
        }
    });
}

function deleteRecord(_id){
    bootbox.confirm({
        message: '¿Seguro que desea eliminar?', 
        buttons: {
            confirm: {
                label: 'Sí',
                className: 'btn-primary'
            },
            cancel: {
                label: 'Cancelar',
                className: 'btn-secondary'
            }
        },
        callback: function(result) {
            if(result){
                $.ajax({
                    url: '/api/user/delete/' + _id,
                    type:'DELETE',
                    success: function(data) {
                        humane.log(data.message);
                        if(data.success){
                            table.ajax.reload();
                        }
                    }
                });
            }
        }
    });
}