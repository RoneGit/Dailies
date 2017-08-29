/**
 * Created by OferMe on 13-May-17.
 */

function signUser() {

    $.ajax({
        url: "/signin",
        type: 'POST',
        data: {
            fname: $("#fname").val(),
            lname: $("#lname").val(),
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function (isExist) {
            if (isExist == 1) {
                $('#res').empty();
                $('<h5 style="color: white"> Email already exist.</h5>').appendTo($('#res'));
            }
            else {
                window.location.replace("index.html");
            }
        }
    });


}