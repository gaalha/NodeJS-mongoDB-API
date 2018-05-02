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

function doLogin() {
    var form = $('#loginForm');
    var data = form.serialize();
    $.ajax({
        url: CONSTANTS.routes.authorization.login,
        method: 'POST',
        data:data,
        success:function (data) {
            if (data.success){
                window.location.href = "/";
            }else{
                humane.log(data.message);
            }
        }
    });
}

function startValidation(){
    $('#loginForm').validate({
        rules: {
            txtUserEmail: {
                required: true, minlength: 10,
                maxlength: 50,
                email: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtPassword: {
                required:true,
                minlength: 8,
                maxlength: 20,
                normalizer: function(value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            txtUserEmail: {
                required: CONSTANTS.lang.login.emptyEmail,
                minlength: CONSTANTS.lang.login.invalidEmail,
                maxlength: CONSTANTS.lang.login.invalidEmail,
                email: CONSTANTS.lang.login.invalidEmail
            },
            txtPassword: {
                required: CONSTANTS.lang.login.emptyPassword,
                minlength: CONSTANTS.lang.login.minPassword,
                maxlength: CONSTANTS.lang.login.maxPassword
            }
        },
        submitHandler: function(form) {
            doLogin();
        }
    });
}
