$(document).ready(function(){
    $('#site').click(function(event) {
        var href = $('#site').attr('href');

        if (href.includes('https://') || href.includes('http://')) {
            var win = window.open(href, '_blank');
            win.focus();
        }else{
            var win = window.open('http://' + href, '_blank');
            win.focus();
        }
    });
});
