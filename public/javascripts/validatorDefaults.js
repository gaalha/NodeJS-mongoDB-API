
$.validator.setDefaults({    
    highlight: function(element, errorClass, validClass){
        $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
        console.log('Removed class has-success');
        $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
    },
    unhighlight: function(element, errorClass, validClass){
        $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
        console.log('Removed class has-error');
        $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
    }
});
