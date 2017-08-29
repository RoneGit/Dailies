/**
 * Created by Ron on 27-Aug-17.
 */

$(function () {
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "getUserNotifications",
        },
        success: function (userNotificationsList) {

        }
    });
});