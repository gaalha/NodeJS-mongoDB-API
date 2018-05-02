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
function passwordReset(){
    var form = $('#resetForm');
    var data = form.serialize();
    $.ajax({
        url: CONSTANTS.routes.authorization.passwordReset,
        type: 'POST',
        data: data,
        success:function(data){
            humane.log(data.message, { timeout: 3000, clickToClose: true })
            if(data.success==true){
                setTimeout(function(){ window.location.href = "/login"; }, 3000);
            }
        }
    });
}

function startValidation(){
    $('#resetForm').validate({
        rules: {
            txtEmail: {
                required: true,
                minlength: 10,
                maxlength:50,
                email: true
            }
        },
        messages: {
            txtEmail: {
                required: CONSTANTS.lang.login.resetPassword.emptyEmail,
                email: CONSTANTS.lang.login.resetPassword.invalidEmail
            }
        },
        submitHandler: function(form) {
            passwordReset();
        }
    });
}
