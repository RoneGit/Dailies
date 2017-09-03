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
                var picUrl ="http://res.cloudinary.com/ronerez/image/upload/v1502455157/empty_profile_it5elf.png";
                if (user.profilePic != null && user.profilePic != "") {
                    picUrl = user.profilePic;
                }
                var text =
                    '<img id="smallProfilePic"' +
                    'src="'+ picUrl +'"' +
                    'class="img-rounded" alt="Cinque Terre" style="margin-right: 3px" width="25" height="25">'+ capitalizeFirstLetter(user.fname) +'';
                document.getElementById('userButton').innerHTML = text //capitalizeFirstLetter(user.fname);
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

function searchUsers() {
    var searchText = $("#searchText").val();
    window.location.replace("/searchResultsPage.html?search_for=" + searchText)
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log("cookie created id:"+cvalue);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loginByCookie() {
    var id = getCookie("id");
    if (id != "") {
        $.ajax({
            url: "login",
            type: 'POST',
            data: {
                request_type: "loginByCookie",
                user_id: id
            },
            success: function (validUser) {
                if (validUser == true) {
                    window.location.replace("searchAndFeed.html");
                }
            }
        });
    }
}


