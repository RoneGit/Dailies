/**
 * Created by Ron on 27-Aug-17.
 */

$(function () {
    getNotifications();
    $("#msgNotifier").find('span').html("");


});

function getNotifications() {
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "getUserNotifications"
        },
        success: function (notificationsList) {
            console.log("notificationsList");
            console.log(notificationsList);
            printNotifications(notificationsList);

        }
    });
}

function printPendingBusinessNotification(not) {
    $("#businessNotificationsDiv").find("#pendingNotifications").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showUserProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        '         <span id="senderLinkSpan">' +
        '             <button  data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '         </span>' +
        "       Applied For " +
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span>' +
        '   <div id="hireRejectBtns" style="float:right">' +
        '       <button class="btn btn-sm btn-primary" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" onclick="HireOrRejectClick(this)">Hire</button>' +
        '       <button class="btn btn-sm btn-danger" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" onclick="HireOrRejectClick(this)">Reject</button>' +
        '   </div>' +
        '</div>');
}

function HireOrRejectClick(btn) {
    var hiredOrRejectText = $(btn).text() + " ";
    var reqType = "handle" + $(btn).text() + "Request";
    var notId = $(btn).attr("data-not-id");
    var applyId = $(btn).attr("data-apply-id");
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "handleHireRejectRequest",
            not_id: notId,
            apply_id: applyId,
            is_hire: $(btn).text() == "Hire"
        },
        success: function (flag) {
            var senderLinkSpan = $("#not" + notId).find("#senderLinkSpan");
            console.log((senderLinkSpan));
            var jobName = $("#not" + notId).find("#jobName");
            $("#not" + notId).find("#notMsg").empty();
            $("#not" + notId).find("#notMsg").append(' You ');
            $("#not" + notId).find("#notMsg").append(hiredOrRejectText);
            $("#not" + notId).find("#notMsg").append(senderLinkSpan);
            $("#not" + notId).find("#notMsg").append(' For ');
            $("#not" + notId).find("#notMsg").append(jobName);
            $("#not" + notId).find("#hireRejectBtns").remove();
        }
    });
}

/*function rejectClick(btn) {
    var notId=$(btn).attr("data-not-id");
    var applyId=$(btn).attr("data-apply-id");
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "handleRejectRequest",
            not_id:notId,
            apply_id:applyId
        },
        success: function (flag) {
            var senderLinkSpan=$("#not"+notId).find("#senderLinkSpan");
            console.log((senderLinkSpan));
            var jobName=$("#not"+notId).find("#jobName");
            $("#not"+notId).find("#notMsg").empty();
            $("#not"+notId).find("#notMsg").append(' You Reject ');
            $("#not"+notId).find("#notMsg").append(senderLinkSpan);
            $("#not"+notId).find("#notMsg").append(' For ');
            $("#not"+notId).find("#notMsg").append(jobName);
        }
    });
}
function hireClick(btn) {
    var notId=$(btn).attr("data-not-id");
    var applyId=$(btn).attr("data-apply-id");
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "handleHireRequest",
            not_id:notId,
            apply_id:applyId
        },
        success: function (flag) {
            var senderLinkSpan=$("#not"+notId).find("#senderLinkSpan");
            console.log((senderLinkSpan));
            var jobName=$("#not"+notId).find("#jobName");
            $("#not"+notId).find("#notMsg").empty();
            $("#not"+notId).find("#notMsg").append(' You Hired ');
            $("#not"+notId).find("#notMsg").append(senderLinkSpan);
            $("#not"+notId).find("#notMsg").append(' For ');
            $("#not"+notId).find("#notMsg").append(jobName);
        }
    });
}*/
////// rewrite this ////
function printUserNotification(not) {

    $("#userNotificationsDiv").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showUserProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span>' +
        '       <button data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '   </span>' +
        not.isHired ? " Agree To Hire You " : +" Did Not Agree To Hire You " +
            '</div>');
}

function printNotPendingBusinessNotification(not) {
    var hireOrRejectText = not.isApproved == true ? " Hired " : " Rejected ";
    $("#businessNotificationsDiv").find("#notPendingNotifications").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showUserProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        ' You ' + hireOrRejectText+
        '         <span id="senderLinkSpan">' +
        '             <button  data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '         </span>' +
        ' For '+
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span>' +
        '</div>');
}

function printNotifications(notifications) {
    notifications.forEach(function (not) {

        switch (not.type) {
            case 0:
                if (not.isPending) {
                    printPendingBusinessNotification(not);
                } else {
                    printNotPendingBusinessNotification(not);
                }
                break;
            case 1:
                printUserNotification(not);
        }
    });

}


function getUserInfo(userId, div) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getUserInfo",
            user_id: userId
        },
        success: function (userInfo) {
            $(div).find("#userName").text(userInfo.fname + " " + userInfo.lname);

        }
    });
}

function getBusinessInfo(id, div) {
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            business_id: id
        },
        success: function (businessInfo) {
            $(div).find("#businessName").text(businessInfo.name + ":  ");
            $(div).find("#businessImg").attr("src", businessInfo.profilePicUrl);
        }
    });
}
