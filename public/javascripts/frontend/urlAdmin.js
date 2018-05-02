var gridUrlbUttons = "";
var tableUrl;

function prepareUrlButtons(){
    var bodyButtons = $("#gridUrlButtons").val();
    var tagsUrl = $("<div/>");
    tagsUrl.append(bodyButtons);

    $("#btnNewUrl").click(function(){
        showUrlDialog()
    });

    gridUrlbUttons = "<center>"+tagsUrl.html()+"<center>";
}

function bindLinkButtons(){
    $('#urlGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.preventDefault) event.preventDefault();
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var objUrl = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='qr'){ generateQrWeb(objUrl.idUrl); }
        else if(action=='editUrl'){ showUrlDialog(objUrl._id, objUrl.idUrl); }
        else if(action=='deleteUrl'){ deleteUrlRecord(objUrl._id); }
    });
}

function drawRowNumbers(selector, tableUrl){
    if(typeof(tableUrl)=='undefined') return;

    var info = tableUrl.page.info();
    var index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,objUrl){
        if($(objUrl).hasClass('dataTables_empty')) return;
        $(objUrl).addClass('text-center').html(index++);
    });
}

function initUrlGrid(idClient){
    tableUrl = $('#urlGrid')
        .on('draw.dt',function(e, settings, json, xhr){
            setTimeout(function(){bindLinkButtons();},500);
            drawRowNumbers('#urlGrid', tableUrl);
        }).DataTable({
        language: {
            url: CONSTANTS.lang.dataTable.url
        },
        ajax: CONSTANTS.routes.url.getList.replace(':id', idClient),
        aoColumns: [
            {data: '_id', sortable: false, searchable:false},
            {data: 'idUrl', sortable: false, searchable:false},
            {data: 'urlName'},
            {
                data: 'viewsCount',
                render:function(data, type, row){
                    return '<span class="label label-info"> <i class="fa fa-eye"></i> '+row.viewsCount+'</span>';
                }
            },
            {
                sortable:false, searchable:false,
                render:function(data,type,row,meta){
                    return gridUrlbUttons.replace("{data}",Base64.encode(JSON.stringify(row)));
                }
            }
        ]
    });
    $('#urlGrid').removeClass('display').removeClass('dataTable').addClass('table table-hover table-bordered table-stripped table-responsive');
}

function showUrlDialog(_id, idUrl){
    var isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? CONSTANTS.lang.label.edit : CONSTANTS.lang.label.new),
        message: $("#urlFormBody").val(),
        className: 'modalSmall'
    });
    startUrlValidation();

    if(isEditing){
        $("#txtId").val(_id);
        $("#txtIdUrl").val(idUrl);
        loadUrlData(_id);
    }
    $('#txtIdClient').val($('#txtIdClientHidden').val());
}

function loadUrlData(_id){
    var form = $("#urlForm");
    var name= $('#txtUrlName');
    var viewsCount = $('#txtViewsCount');

    $.ajax({
        url: CONSTANTS.routes.url.getInfo.replace(':id', _id),
        type:'GET',
        success:function(data){
            if(data.success == true){
                name.val(data.data.urlName);
                viewsCount.val(data.data.viewsCount);
            }
        }
    });
}

function startUrlValidation(){
    $('#urlForm').validate({
        rules: {
            txtUrlName: {
                required: true,
                minlength: 5,
                maxlength: 512,
                noSpace: true,
                url: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            txtUrlName: {
                required: CONSTANTS.lang.url.required,
                minlength: CONSTANTS.lang.url.minlength,
                maxlength: CONSTANTS.lang.url.maxlength,
                noSpace: CONSTANTS.lang.url.space,
                url: CONSTANTS.lang.url.url
            }
        },
        submitHandler: function(form) {
            saveUrl();
        }
    });
}

function saveUrl(){
    var form = $("#urlForm");
    var data = form.serialize();
    $.ajax({
        url: CONSTANTS.routes.url.save,
        type: 'post',
        data:  data,
        success:function(data){
            humane.log(data.message);
            if(data.success==true){
                tableUrl.ajax.reload();
                dialog.modal('hide');
            }
        }
    });
}

function deleteUrlRecord(_id){
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
                    url:CONSTANTS.routes.url.delete.replace(':idClient', idClient).replace(':id', _id) ,
                    type: 'DELETE',
                    success:function(data){
                        humane.log(data.message)
                        if(data.success){
                            tableUrl.ajax.reload();
                        }
                    }
                });
            }
        }
    });
}

function generateQrWeb(idUrl){
    dialog = bootbox.dialog({
        title: CONSTANTS.lang.url.title,
        message: "<center><canvas id='qrHidden' style='display: none;'>"
        + "</canvas><canvas id='qr'></canvas></center><br/><br/>"
        + "<a id='dl' class='text-right' href='#' download='ContactQR.png'>"
        + "<i class='fa fa-download'/> &nbsp;" + CONSTANTS.lang.contact.downloadQr + "</a>"
    });

    var url = CONSTANTS.routes.url.generateQR.replace(':idUrl', idUrl);
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

    var canvas = document.getElementById("qrHidden");
    function downloadQr() {
      var dt = canvas.toDataURL('image/png');
      dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
      this.href = dt;
    };
    document.getElementById("dl").addEventListener('click', downloadQr, false);
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

$.validator.addMethod("noSpace", function(value, element) {
    return value.indexOf(" ") < 0 && value != "";
});
