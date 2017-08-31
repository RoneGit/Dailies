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
    //var searchText = document.getElementById('searchText');
    $.ajax({
        url: "searchServlet",
        type: 'POST',
        data: {request_type: "searchUsersAndBusinesses",
                searchText:searchText },
        success: function (usersAndBusinesses) {
            /*var searchResults = document.getElementById('searchResults');
            while (searchResults.firstChild) {
                searchResults.removeChild(searchResults.firstChild);
            }
            if (usersAndBusinesses != null) {
                for (i = 0; i <= usersAndBusinesses.length - 1; i++) {
                    var option = document.createElement('option');
                    option.setAttribute("id",usersAndBusinesses[i].id);
                    option.setAttribute("onclick",goToPage(option));
                    if(usersAndBusinesses[i].fname != null) {
                        option.setAttribute("type","0");
                        option.value = usersAndBusinesses[i].fname;
                    }
                    else{
                        option.setAttribute("type","1");
                        option.value = usersAndBusinesses[i].name;
                    }
                    searchResults.appendChild(option);
                }
                searchResults.setAttribute("open");
            }*/
            currentSearch = usersAndBusinesses;
            window.location.replace("searchResultsPage.html");
        }
    });
}


