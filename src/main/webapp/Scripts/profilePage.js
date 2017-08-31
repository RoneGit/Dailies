/**
 * Created by Ron on 19-May-17.
 */

var currentUserShown;

$(function () {
    var userId;
    userId = getUrlParameter('user_id');
    if (userId == null) {
        getUserFromSession();
    }
    else {
        getUserFromUrlId(userId);
    }
    //loadFriends();
});

function getUserFromUrlId(userId) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getUserInfo",
            user_id: userId
        },
        success: function (userInfo) {
            currentUserShown = userInfo;
            console.log(userInfo)
            printUser(userInfo);
            //printUserInfoPanelBody(currentUserShown.about)
        }
    });
}

function getUserFromSession() {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getUserDataByEmailFromSession"},
        success: function (userData) {
            currentUserShown = userData;
            printUser(userData);
            //printUserInfoPanelBody(currentUserShown.about);
        }
    });
}

function loadFriends() {
    $('#friendsPanelBody').empty();
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getFriends",
            currentUserLogedInId: currentUserLoggedIn.id,
            currentUserShownId: currentUserShown.id},
        success: function (friendListWithLogedInData) {
            for (i = 0; i <= friendListWithLogedInData.length - 1; i++) {
                var pair = friendListWithLogedInData[i];
                var userData = pair.left;
                var isLogedIn = pair.right;
                var loggedInBall = "http://res.cloudinary.com/dailies/image/upload/v1504200406/Red_sphere.png";
                if (isLogedIn == 1)
                    loggedInBall = "http://res.cloudinary.com/dailies/image/upload/v1504200406/Green_sphere.png";
                var linkToUser = getLinkWithStyle(i + "Form", "profilePageServlet", userData.fname , "float: left", [["request_type", "loadUserProfile"], ["user_id", userData.id]]);
                var currText2 ="</span>" + linkToUser + "<span style ='float: left; margin-left: 10px'> Recommendation: " + currentRec.recommendation + "</span>";
                $('#friendsPanelBody').append('<div><img id="loggedInBall" src="'+ loggedInBall +'" class="img-rounded" alt="Cinque Terre" style="margin-right: 3px" width="5" height="5"><p style ="float: left">' + currText2 + '</p></div><br>');
                $('#friendsPanelBody').append('<hr class="hr-soften">');
            }
        }
    });
}

function printUser(userData) {
    /*document.getElementById('userName').innerHTML = userData.fname + " " + userData.lname;
    document.getElementById('userEmail').innerHTML = userData.email;
    if (userData.address != null && userData.address != "")
        document.getElementById('userLocation').innerHTML = userData.address;
    if (userData.skills != null && userData.skills != "")
        document.getElementById('userSkills').innerHTML = userData.skills;*/
    if (userData.profilePic != null && userData.profilePic != "")
        document.getElementById('profilePic').src = userData.profilePic;
    if (userData.CV != null && userData.CV != "") {
        var url = "location.href='" + userData.CV + "';"
        document.getElementById("CVbtnn").setAttribute("onClick", url);
    }
    printAbout();
}

function aboutClick() {
    setActive($("#aboutBtnn"));
    printAbout();
}

function printAbout()
{
    $("#userInfoPanelBody").empty();
    var panel = $("#userInfoPanelBody");
    panel.append(
        '<div class="row"><label class="control-label col-sm-2">Name: </label>' + currentUserShown.fname + ' ' + currentUserShown.lname +'</div>'+
        '<div class="row"><label class="control-label col-sm-2">Email: </label>' + currentUserShown.email + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Address: </label>' + currentUserShown.address + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Skills: </label></div>' +
        '<div class="row" style="margin-left: 3px"><label class="control-label"></label>' + currentUserShown.skills + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">About: </label></div>' +
        '<div class="row" style="margin-left: 3px"><label class="control-label"></label>' + currentUserShown.about + '</div>')
}

function recommendationsClick() {
    setActive($("#recommendationsBtn"));
    recommendationForm = "<div class='row'> <div class='col-md-5'> <label for='recommendationText'>Enter Recommendation:</label> </div> <textarea class='form-control' rows='2' id='recommendationText'></textarea> <button onclick='registerRecommendation()' class='btn btn-outline btn-primary btn-large'>Submit</button> </div><div id = 'recomendationsPlace'></div>"
    printUserInfoPanelBody(recommendationForm);
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getCurrentUserRecommendation",
            currentUserShownId: currentUserShown.id,
        },
        success: function (recommendationList) {
            printRecommendations(recommendationList);
        }
    });
}

function printRecommendations(recommendationList) {
    $('#recomendationsPlace').empty();
    for (i = 0; i <= recommendationList.length -1; i++) {
        var currentRec = recommendationList[i];
        var linkToUser = getLinkWithStyle(i + "Form", "profilePageServlet", currentRec.userInputedName , "float: left", [["request_type", "loadUserProfile"], ["user_id", currentRec.userInputedId]]);
        var currText2 = "<span>Name:  </span>" + linkToUser + "<span style ='float: left; margin-left: 10px'> Recommendation: " + currentRec.recommendation + "</span>";
        $('#recomendationsPlace').append('<div><p style ="float: left">' + currText2 + '</p></div><br>');
        $('#recomendationsPlace').append('<hr class="hr-soften">');
    }
}

function jobHistoryClick() {
    setActive($("#jobHistoryBtn"));
    $("#userInfoPanelBody").empty();
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getFinishedJobOffersForUser",
            currentUserIdSearch: currentUserShown.id
        },
        success: function (jobOffersPairs) {
            printJobOffers(jobOffersPairs);
        }
    });
}

function futureJobsClick()
{
    setActive($("#futureJobsBtn"));
    $("#userInfoPanelBody").empty();
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getFutureJobOffersForUser",
            currentUserIdSearch: currentUserShown.id
        },
        success: function (jobOffersPairs) {
            printJobOffers(jobOffersPairs);
        }
    });
}

function printJobOffers(jobOffersPairs)
{
    for (i = 0; i <= jobOffersPairs.length; i++) {

        var pair = jobOffersPairs[i];
        var business = pair.left;
        var jobOffer = pair.right;
        var linkToBusiness = getLinkWithStyle(i + "Form", "businessPage", business.name, "float: left", [["request_type", "loadBusinessPage"], ["business_id", business.id]]);
        var currText = "<span>Business Name: </span>" + linkToBusiness + "<span style ='float: left; margin-left: 10px'> Job Title: " + jobOffer.name + "</span><span style ='float: left ; margin-left: 10px'> Job Details: " + jobOffer.details + "</span>";
        $('#userInfoPanelBody').append('<div><p style ="float: left">' + currText + '</p></div><br>');
        $('#userInfoPanelBody').append('<hr class="hr-soften">');
    }
}

function businessesClick() {
    setActive($("#businessesBtn"));
    $("#userInfoPanelBody").empty();
    var mapstr;
    var mydatas = new Map();
    $(function () {
        $.ajax({
            url: "businessPage",
            type: 'POST',
            data: {request_type: "getCurrentUserBusinesssesList",
                currentUserShownId: currentUserShown.id,},
            success: function (businessesList) {
                for (i = 0; i <= businessesList.length; i++) {
                    var linkToBusiness = getLinkWithStyle(i + "Form", "businessPage", businessesList[i].name, "float: left", [["request_type", "loadBusinessPage"], ["business_id", businessesList[i].id]]);
                    var currText = "<span>Business Name: </span>" + linkToBusiness + "<span style ='float: left; margin-left: 10px'> City: " + businessesList[i].city + "</span><span style ='float: left ; margin-left: 10px'> Number: " + businessesList[i].phone + "</span>";
                    $('#userInfoPanelBody').append('<div><p style ="float: left">' + currText + '</p></div><br>');
                    $('#userInfoPanelBody').append('<hr class="hr-soften">');
                }
            }
        });
    });
}

function printUserInfoPanelBody(userInfoBodyText) {
    $("#userInfoPanelBody").empty();
    if (userInfoBodyText != null && userInfoBodyText != "")
        $('#userInfoPanelBody').append('<span>' + userInfoBodyText + '</span><br>');
}

function setActive(item) {

    var v = $('#profile-nav').find("li");
    v.each(function () {
        $(this).removeClass("active");
    });
    $("#userInfoPanelHeader").html($(item).text());
    $(item).parent().addClass("active");
}

function registerRecommendation() {
    var rec = $("#recommendationText").val();
    if (rec != null && rec != "") {
        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: {
                request_type: "registerRecommendation",
                currentUserLogedInId: currentUserLoggedIn.id,
                currentUserLogedInName: currentUserLoggedIn.fname + " " +currentUserLoggedIn.lname,
                currentUserShownId: currentUserShown.id,
                recommendation: rec
            },
            success: function (recommendationList) {
                printRecommendations(recommendationList);
            }
        });
    }
}

function addAsFriend()
{
    if(currentUserLoggedIn.id != currentUserShown.id) {
        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: {
                request_type: "addFriend",
                currentUserLogedInId: currentUserLoggedIn.id,
                currentUserShownId: currentUserShown.id,
            },
            success: function (flag) {
                if (flag == 1) {
                    alert("You are already friends");
                }
            }
        });
    }
}