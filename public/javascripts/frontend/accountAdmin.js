$(document).ready(function(){
    startValidation();
    loadData();

    $("#divPassword").hide();
    $("#chkChangePassword").click(function () {
        $("#divPassword").toggle();

        if($("#chkChangePassword").is(':checked')){
            $("#statusChangePassword").val("1");
        }else{
            $("#statusChangePassword").val("0");
        }
    });
});

function loadData(){
    var form = $("#userForm");
    var id = $('#txtIdHidden')
    var name= $('#txtName');
    var lastName= $('#txtLastName');
    var userEmail= $('#txtUserEmail');
    $.ajax({
        url: CONSTANTS.routes.user.getInfo,
        type:'GET',
        success:function(data){
            if(data.success == true){
                id.val(data.data._id);
                name.val(data.data.name);
                lastName.val(data.data.lastName);
                userEmail.val(data.data.userEmail);
            }
        }
    });
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
            }},
            txtLastName: {
                required:true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                return $.trim(value);
            }},
            txtUserEmail: {
                required:true,
                normalizer: function(value) {
                return $.trim(value);
            }},
            txtPassword: {
                minlength: 8,
                required: true,
                normalizer: function(value) {
                return $.trim(value);
            }},
            txtPassword1: {
                minlength: 8,
                required: true,
                equalTo:"#txtPassword",
                normalizer: function(value) {
                return $.trim(value);
            }}
        },
        messages: {
            txtName: {
                required: CONSTANTS.lang.account.required,
                minlength: CONSTANTS.lang.account.minlength,
                maxlength: CONSTANTS.lang.account.maxlength
            },
            txtLastName: {
                required: CONSTANTS.lang.account.required,
                minlength: CONSTANTS.lang.account.minlength,
                maxlength:CONSTANTS.lang.account.maxlength
            },
            txtUserEmail: {required: CONSTANTS.lang.account.required},
            txtPassword: {
                required: CONSTANTS.lang.account.required,
                minlength: CONSTANTS.lang.account.password.minlength
            },
            txtPassword1: {
                required: CONSTANTS.lang.account.required,
                minlength: CONSTANTS.lang.account.password.minlength,
                equalTo: CONSTANTS.lang.account.password.equalTo
            }
        },
        submitHandler: function(form) {
            save();
        }
    });
}

function save(){
    var form = $("#userForm");
    var data = form.serialize();
    $.ajax({
       url: CONSTANTS.routes.user.save,
       type: 'POST',
       data:  data,
       success:function(data){
           if(data.success==true){
                humane.log(data.message, {timeout: 3000, clickToClose:true});
                setTimeout(function(){
                    document.location.replace('/index');
                }, 1800);
           }
       }
    });
}

