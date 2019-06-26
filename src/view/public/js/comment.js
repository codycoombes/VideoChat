

function reloadComments(data) {
    $('#displaycomments').load('/api/comments/' + data + ' #comments');
    $('#comment-title').load('/api/comments/' + data + ' #comment-title');
}

$('#comment-form').submit(function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/api/comments/submit',
        data: $(this).serialize(),
        dataType: 'json'
    }).done(function (data) {
        reloadComments(data);
    });
});



$('#displaycomments').on('click', '.delete-button', function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/api/comments/delete',
        data: $(this).closest('form').serialize(),
        dataType: 'json'
    }).done(function (data) {
        reloadComments(data);
    });
});



var showChar = 250;  // How many characters are shown by default
var ellipsestext = "...";
var moretext = "Show more";
var lesstext = "Show less";

$('.more').each(function () {
    var content = $(this).html();

    if (content.length > showChar) {

        var c = content.substr(0, showChar);
        var h = content.substr(showChar, content.length - showChar);

        var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<div class="ib"><a href="" class="morelink">' + moretext + '</a></div></span>';

        $(this).html(html);
    }

});

$("#displaycomments").on('click', '.morelink', function () {
    if ($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
    } else {
        $(this).addClass("less");
        $(this).html(lesstext);
    }
    $(this).parent().parent().prev().toggle(); //ellipses
    $(this).parent().prev().toggle(); //actual text
    return false;
});



// when comments are reloaded with ajax, rebind

$(document).ajaxStop(function () {


    // Configure/customize these variables.
    var showChar = 250;  // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "Show more";
    var lesstext = "Show less";



    $('.more').each(function () {
        var content = $(this).html();

        if (content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<div class="ib"><a href="" class="morelink">' + moretext + '</a></div></span>';

            $(this).html(html);
        }

    });

});

