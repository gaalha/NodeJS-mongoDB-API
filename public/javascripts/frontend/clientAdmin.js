var gridButtons = "";
var table;

$(document).ready(function(){
    prepareButtons();
    initGrid();
});

function prepareButtons(){
    var bodyButtons = $("#gridButtons").val();
    var tags = $("<div/>");
    tags.append(bodyButtons);

    $("#btnNew").click(function(){
        showDialog()
    });
    gridButtons = "<center>"+tags.html()+"<center>";
}

function bindButtons(){
    $('#clientGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var obj = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='link'){ showUrlGrid(obj._id); }
        else if(action=='edit'){ showDialog(obj._id); }
        else if(action=='delete'){ deleteRecord(obj._id); }
        else if(action=='contacts'){ showContactGrid(obj._id); }
    });
}

function drawRowNumbers(selector,table){
    if(typeof(table)=='undefined') return;

    var info = table.page.info();
    var index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,obj){
        if($(obj).hasClass('dataTables_empty')) return;
        $(obj).addClass('text-center').html(index++);
    });
}

function initGrid(){
    table = $('#clientGrid')
        .on('draw.dt',function(e,settings,json,xhr){
            setTimeout(function(){bindButtons();},500);
            drawRowNumbers('#clientGrid', table);
        }).DataTable({
            language: {
                url: CONSTANTS.lang.dataTable.url
            },
            ajax: CONSTANTS.routes.client.getList,
            aoColumns: [
                {data: 'idClient', sortable: false, searchable:false},
                {data: 'clientName'},
                {data: 'address'},
                {data: 'clientEmail'},
                {data: 'phone'},
                {
                    sortable:false, searchable:false,
                    render:function(data,type,row,meta){
                        return gridButtons.replace("{data}",Base64.encode(JSON.stringify(row)));
                    }
                }
            ]
    });
    $('#clientGrid').removeClass('display').addClass('table table-bordered table-hover dataTable');
}

function deleteRecord(_id){
    bootbox.confirm({
        message: CONSTANTS.lang.client.deleteQuestion,
        buttons: {
            confirm: {
                label: CONSTANTS.lang.label.ok,
                className: 'btn-primary'
            },
            cancel: {
                label: CONSTANTS.lang.label.cancel,
                className: 'btn-secondary'
            }
        },
        callback: function(result) {
            if(result){
                $.ajax({
                    url:CONSTANTS.routes.client.delete.replace(':id', _id),
                    type:'DELETE',
                    success:function(data){
                        humane.log(data.message)
                        if(data.success){
                            table.ajax.reload();
                        }
                    }
                });
            }
        }
    });
}

function showDialog(_id){
    var isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? CONSTANTS.lang.label.edit : CONSTANTS.lang.label.new),
        message: $("#clientFormBody").val(),
        className:"modalSmall"
    });
    noText();
    startValidation();

    if(isEditing){
        $("#saveAndAdd").css({ display: "none" });
        $("#txtIdHidden").val(_id);
        loadData(_id);
    }
}

function loadData(_id){
    var form = $("#clientForm");
    var name = $('#txtClientName');
    var address = $('#txtAddress');
    var email = $('#txtClientEmail');
    var phone = $('#txtPhone');
    $.ajax({
        url: CONSTANTS.routes.client.getDetail.replace(':id', _id),
        type:'GET',
        success:function(data){
            if(data.success == true){
                name.val(data.data.clientName);
                address.val(data.data.address);
                email.val(data.data.clientEmail);
                phone.val(data.data.phone);
            }
        }});
}

function startValidation(){
    var condition = '';
    $('#save, #saveAndAdd').click(function () {
        if (this.id == 'save') {
            condition = true;
        }
        else if (this.id == 'saveAndAdd') {
            condition = false;
        }
    });

    $('#clientForm').validate({
        rules: {
            txtClientName: {
                required: true,
                minlength: 2,
                maxlength: 150,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtAddress: {
                required: true,
                minlength: 2,
                maxlength: 150,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtClientEmail: {
                required: true,
                minlength: 10,
                email: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtPhone: {
                required: true,
                minlength: 6,
                maxlength: 16
            }
        },
        messages: {
            txtClientName: {
                required: CONSTANTS.lang.client.requiredField,
                minlength: CONSTANTS.lang.client.minName,
                maxlength: CONSTANTS.lang.client.maxName
            },
            txtAddress: {
                required: CONSTANTS.lang.client.requiredField,
                minlength: CONSTANTS.lang.client.minAddress,
                maxlength: CONSTANTS.lang.client.maxAddress
            },
            txtClientEmail: {
                required: CONSTANTS.lang.client.requiredField,
                minlength: CONSTANTS.lang.client.minEmail,
                maxlength: CONSTANTS.lang.client.maxEmail,
                email: CONSTANTS.lang.client.invalidEmail
            },
            txtPhone: {
                required: CONSTANTS.lang.client.requiredField,
                minlength: CONSTANTS.lang.client.minPhone,
                maxlength: CONSTANTS.lang.client.maxPhone
            }
        },
        submitHandler: function(form) {
            save(condition);
        }
    });
}

function save(condition){
    var form = $("#clientForm");
    var data = form.serialize();
    $.ajax({
       url: CONSTANTS.routes.client.save,
       type: 'POST',
       data:  data,
       success:function(data){
           humane.log(data.message);
           if(data.success == true){
                table.ajax.reload();
                dialog.modal('hide');
                if (condition === false) {
                    showContactGrid(data.data._id);
                    showContactDialog();
                    $('#txtName').focus();
                }
           }
       }
    });
}

function noText(){
    $('#txtPhone').on('keypress', function(key) {
        if(key.charCode < 48 || key.charCode > 57) {
            if(key.charCode < 40 || key.charCode > 41){
                if(key.charCode != 43){
                    if(key.charCode != 32){
                        return false
                    }
                }
            }
        };
    });
};


function showContactGrid(idClient){
   dialog = bootbox.dialog({
        title: CONSTANTS.lang.client.contactBootbox,
        message: $("#contactBody").val(),
        size: "large"
    });

    prepareContactButtons();
    $('#txtIdClientHidden').val(idClient);
    initContactGrid(idClient);
}

function showUrlGrid(idClient){
    dialog = bootbox.dialog({
        title: CONSTANTS.lang.client.urlBootbox,
        message: $("#urlBody").val(),
        size: "large"
    });

    prepareUrlButtons();
    $('#txtIdClientHidden').val(idClient);
    initUrlGrid(idClient);
}

$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }
);
