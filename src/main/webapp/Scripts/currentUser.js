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
                console.log("currentUserLoggedIn");
                currentUserLoggedIn = user;
                document.getElementById('userButton').innerHTML = capitalizeFirstLetter(user.fname);
                if (userData.profilePic != null && userData.profilePic != "")
                    document.getElementById('smallProfilePic').src = userData.profilePic;
            }
        }
    });

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

function logOut() {
    $.ajax({
        url: "login",
        type: 'POST',
        data: {
            request_type: "logOut"
        },
        success: function (res) {
            if(res){
                setCookie("id",currentUserLoggedIn.id,0);
                currentUserLoggedIn=null;
                window.location.replace("index.html");
            }

        }
    });
}


