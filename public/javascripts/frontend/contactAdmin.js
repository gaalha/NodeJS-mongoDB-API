var gridContactButtons = "";
var tableContact;

function prepareContactButtons(){
    var bodyButtons = $("#gridContactButtons").val();
    var tagsContact = $("<div/>");
    tagsContact.append(bodyButtons);

    $("#btnNewContact").click(function(){
        showContactDialog()
    });
    gridContactButtons = "<center>"+tagsContact.html()+"<center>";
}

function bindContactButtons(){
    $('#contactGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.preventDefault) event.preventDefault();
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var objContact = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='qr'){ generateQR(objContact.idContact); }
        else if(action=='editContact'){ showContactDialog(objContact._id, objContact.idContact); }
        else if(action=='deleteContact'){ deleteContactRecord(objContact._id); }
        else if(action=='downloadContact'){downloadVCard(objContact._id);}
    });
}

function drawContactRowNumbers(selector,tableContact){
    if(typeof(tableContact)=='undefined') return;

    var info = tableContact.page.info();
    var index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,objContact){
        if($(objContact).hasClass('dataTables_empty')) return;
        $(objContact).addClass('text-center').html(index++);
    });
}

function initContactGrid(idClient){
    tableContact = $('#contactGrid')
        .on('draw.dt',function(e, settings, json, xhr){
            setTimeout(function(){bindContactButtons();},500);
            drawContactRowNumbers('#contactGrid', tableContact);
        }).DataTable({
        language: {
            url: CONSTANTS.lang.dataTable.url
        },
        ajax: CONSTANTS.routes.contact.getList.replace(':id', idClient),
        aoColumns: [
            {data: '_id', sortable: false, searchable:false},
            {data: 'idContact', sortable: false, searchable:false},
            {data: 'name'},
            {data: 'lastName'},
            {
                data: 'firstEmail',
                render:function(data){
                    return '<div class="email-contact-label">'+data+'</div>';
                }
            },
            {data: 'cellPhone'},
            {
                data: 'viewsCount',
                render:function(data,type,row){
                    return '<span class="label label-info"> <i class="fa fa-eye"></i> '+row.viewsCount+'</span>' +
                    '<span class="label label-default"> <i class="fa fa-download"></i> '+row.downloadCount+'</span>';
                }
            },
            {
                sortable:false, searchable: false,
                render:function(data,type,row,meta){
                    return gridContactButtons.replace("{data}", Base64.encode(JSON.stringify(row)));
                }
            }
        ]
    });
    $('#contactGrid').removeClass('display').removeClass('dataTable').addClass('table table-hover table-bordered table-stripped table-responsive');
}


function showContactDialog(_id, idContact){
    var isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? CONSTANTS.lang.label.edit : CONSTANTS.lang.label.new),
        message: $("#contactFormBody").val(),
        size: 'large'
    });
    startContactValidation();
    $('#txtName').focus();

    initSelect2('txtCountry', CONSTANTS.lang.label.countries);

    if(isEditing){
        $("#txtId").val(_id);
        $("#txtIdContact").val(idContact);
        loadContactData(_id);
    }
    $('#txtIdClient').val($('#txtIdClientHidden').val());
}

function loadContactData(_id){
    var form = $("#contactForm");
    var name= $('#txtName');
    var lastName= $('#txtLastName');
    var suffix = $('#txtSuffix');
    var company = $('#txtCompany');
    var job = $('#txtJob');
    var companyDepartment = $('#txtCompanyDepartment');
    var firstEmail = $('#txtFirstEmail');
    var secondEmail = $('#txtSecondEmail');
    var website = $('#txtWebsite');
    var workPhone = $('#txtWorkPhone');
    var cellPhone = $('#txtCellPhone');
    var homePhone = $('#txtHomePhone');
    var street = $('#txtStreet');
    var department = $('#txtDepartment');
    var municipality = $('#txtMunicipality');
    var country = $('#txtCountry');
    var downloadCount = $('#txtDownloadCount');
    var viewsCount = $('#txtViewsCount');

    $.ajax({
        url: CONSTANTS.routes.contact.getInfo.replace(':id', _id),
        type:'GET',
        success:function(data){
            if(data.success == true){
                name.val(data.data.name);
                lastName.val(data.data.lastName);
                suffix.val(data.data.suffix);
                company.val(data.data.company);
                job.val(data.data.job);
                companyDepartment.val(data.data.companyDepartment);
                firstEmail.val(data.data.firstEmail);
                secondEmail.val(data.data.secondEmail);
                website.val(data.data.webSite);
                workPhone.val(data.data.workPhone);
                cellPhone.val(data.data.cellPhone);
                homePhone.val(data.data.homePhone);
                street.val(data.data.street);
                department.val(data.data.department);
                municipality.val(data.data.municipality);
                country.val(data.data.country).trigger('change');
                viewsCount.val(data.data.viewsCount);
                downloadCount.val(data.data.downloadCount);
            }
        }
    });
}

function startContactValidation(){
    phoneNumberValidation();
    $('#contactForm').validate({
        rules: {
            txtName: {
                required: true,
                minlength: 2,
                maxlength: 40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtLastName: {
                required: true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtFirstEmail: {
                required: true,
                email: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtCellPhone: {
                required: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            }
        },
        messages:{
            txtName: {
                required: CONSTANTS.lang.contact.required,
                minlength: CONSTANTS.lang.contact.minlength,
                maxlength: CONSTANTS.lang.contact.maxlength
            },
            txtLastName:{
                required: CONSTANTS.lang.contact.required,
                minlength: CONSTANTS.lang.contact.minlength,
                maxlength: CONSTANTS.lang.contact.maxlength
            },
            txtFirstEmail: {
                required: CONSTANTS.lang.contact.required,
                email: CONSTANTS.lang.contact.email
            },
            txtCellPhone: {required: CONSTANTS.lang.contact.required}
        },
        submitHandler: function(form) {
            saveContact();
        }
    });
}

function saveContact(){
    var form = $("#contactForm");
    var data = form.serialize();
    $.ajax({
       url: CONSTANTS.routes.contact.save,
       type: 'POST',
       data:  data,
       success:function(data){
           humane.log(data.message);
           if(data.success==true){
               tableContact.ajax.reload();
               dialog.modal('hide');
           }
       }
    });
}

function deleteContactRecord(_id){
    var idClient = $('#txtIdClientHidden').val();
    bootbox.confirm({
        message: CONSTANTS.lang.contact.deleteQuestion,
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
                    url:CONSTANTS.routes.contact.delete.replace(':idClient', idClient).replace(':id', _id) ,
                    type: 'DELETE',
                    success:function(data){
                        humane.log(data.message)
                        if(data.success){
                            tableContact.ajax.reload();
                        }
                    }
                });
            }
        }
    });
}

function downloadVCard(_id){
    var id = _id;
    window.location = CONSTANTS.routes.contact.createCard.replace(':id', _id);
}

function generateQR(idContact){
    dialog = bootbox.dialog({
        title: CONSTANTS.lang.contact.title,
        message: "<center><canvas id='qrHidden' style='display: none;'></canvas>"
        + "<canvas id='qr'></canvas></center><br/><br/>"
        + "<a id='dl' class='text-right' href='#' download='ContactQR.png'>"
        + "<i class='fa fa-download'/> &nbsp;" + CONSTANTS.lang.contact.downloadQr + "</a>"
    });

    var url = CONSTANTS.routes.contact.generateQR.replace(':idContact', idContact);

    var qr = new QRious({
        element: $('#qr')[0],
        value: url,
        size: 300
    });

     var qr2 = new QRious({
        element: $('#qrHidden')[0],
        value: url,
        size: 1000
    });

    var canvas = document.getElementById('qrHidden');
    function downloadQr() {
      var dt = canvas.toDataURL('image/png');
      dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
      this.href = dt;
    };
    document.getElementById('dl').addEventListener('click', downloadQr, false);
}

function phoneNumberValidation(){
    $('#txtCellPhone').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key==9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 116) || (key == 189))) {
            e.preventDefault();
        }
    });
    $('#txtWorkPhone').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key==9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 116) || (key == 189))) {
            e.preventDefault();
        }
    });
    $('#txtHomePhone').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key==9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 116) || (key == 189))) {
            e.preventDefault();
        }
    });
}


$.validator.setDefaults({
    highlight: function(element, errorClass, validClass){
        $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
        $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
    },
    unhighlight: function(element, errorClass, validClass){
        $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
        $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
    }
});
