function initAsyncSelect2(id, url, placeholder, isMultiple, data) {
    if (typeof(isMultiple) == "undefined") isMultiple = false;
    if (typeof(data) == "undefined") data = function(term, page) {
        return {
            q: term
        };
    };

    $("#" + id).select2({
        placeholder: placeholder,
        multiple: isMultiple,
        allowClear:true,
        ajax: {
            url: url,
            dataType: 'json',
            type: 'GET',
            data: data,
            results: function(data, page) {
                return {
                    results: data.results
                };
            }
        }
    });
}



function initSelect2(id, placeholder) {
    $("#" + id).select2({
        placeholder: placeholder,
        placeholderOption: 'first'
    });
}


function initMultipleCreatorSelect2(id, placeholder){
    $("#" + id).select2({
        placeholder: placeholder,
        placeholderOption: 'first',
        multiple:true,
        data:[],
        createSearchChoice:function(term, data) {
            if ($(data).filter(function() { return this.text.localeCompare(term)===0; }).length===0) {
              return {id:term, text:term};
            }
        },
    });
}

function getLabelsSelect2(id){
    var data = $("#"+id).select2("data");
    var array = "";
    $.each(data,function(pos,item){
        array += (array!=""?",":"") + item.text;
    });
    return array;
}
