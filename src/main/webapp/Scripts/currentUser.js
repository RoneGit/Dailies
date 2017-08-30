/**
 * Created by Ron on 18-Aug-17.
 */

var currentUserLoggedIn;

$(function () {
    var userId;
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getUserDataByEmailFromSession"},
        success: function (user) {
            if (user != null) {
                currentUserLoggedIn = user;
                document.getElementById('userButton').innerHTML = capitalizeFirstLetter(user.fname);
            }
            else {
                window.location.replace("index.html");
            }
        }
    });
    showOrHideMyBusinessesInMainNavBar();
});

//added
function showOrHideMyBusinessesInMainNavBar() {
    doesUserOwnBusinesses(function (isOwner) {
        if (isOwner) {
            $("#manageBusinesses").show();
            $("#manageBusinesses").children().attr("href", "manageBusinessesPage.html");
        } else {
            $("#manageBusinesses").hide();
            $("#manageBusinesses").children().attr("href", "#");
        }
    });
}


//added
function doesUserOwnBusinesses(handleResult) {
    var isOwner;
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "doesUserOwnBusinesses",
        },
        success: function (res) {
            handleResult(res);
        }
    });

}


