
$(document).ready(function(){
    startValidation();
});

$.validator.setDefaults({
    errorPlacement: function(error, element) {
        error.addClass("help-block");
        element.parents(".form-group").addClass("has-error");

        if(element.prop("type") === "checkbox") {
            error.insertAfter(element.parent("label"));
        } else {
            error.insertAfter(element);
        }
        if (!element.next("span")[0]) {
            $("<span class='form-control-feedback'></span>");
        }
    },
    success: function(label, element) {
        if(!$(element).next("span")[0]) {
            $("<span class='form-control-feedback'></span>");
        }
    },
    highlight: function(element){
        $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
    },
    unhighlight: function(element){
        $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
    }
});

function doPasswordReset(){
    var form = $('#newPassword');
    var data = form.serialize();
    $.ajax({
        url: CONSTANTS.routes.authorization.newPassword,
        type: 'POST',
        data: data,
        success:function(data){
            humane.log(data.message);
            if(data.success==true){
                setTimeout(function(){ window.location.href = "/"; }, 3000);
            }
        }
    });
}

function startValidation(){
    $('#newPassword').validate({
        rules: {
            txtNewOne: {
                required: true,
                minlength: 8,
                maxlength:50
            },
            txtNewTwo: {
                required: true,
                minlength: 8,
                maxlength:50,
                equalTo:'#txtNewOne'
            }
        },
        messages: {
            txtNewOne: {
                required: CONSTANTS.lang.login.resetPassword.emptyPassword,
                minlength: CONSTANTS.lang.login.resetPassword.min,
                maxlength: CONSTANTS.lang.login.resetPassword.max
            },
            txtNewTwo: {
                required: CONSTANTS.lang.login.resetPassword.emptyPassword,
                minlength: CONSTANTS.lang.login.resetPassword.min,
                maxlength: CONSTANTS.lang.login.resetPassword.max,
                equalTo: CONSTANTS.lang.login.resetPassword.match
            }
        },
        submitHandler: function(form) {
            doPasswordReset();
        }
    });
}
