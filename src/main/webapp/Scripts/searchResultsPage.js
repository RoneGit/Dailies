/**
 * Created by Ron on 31-Aug-17.
 */

$(function () {
    if(currentSearch != null) {
        for (i = 0; i <= currentSearch.length - 1; i++) {
            if (currentSearch[i].fname != null) {
                var linkToUser = getLinkWithStyle(i + "Form", "profilePageServlet", currentSearch[i].fname, "float: left", [["request_type", "loadUserProfile"], ["user_id", currentSearch[i].id]]);
                var currText2 = "<span>Name:  </span>" + linkToUser + "<span style ='float: left; margin-left: 10px'> Email: " + currentSearch[i].email + "</span>";
                $('#recomendationsPlace').append('<div><p style ="float: left">' + currText2 + '</p></div><br>');
                $('#recomendationsPlace').append('<hr class="hr-soften">');
            }
            else {
                var linkToBusiness = getLinkWithStyle(i + "Form", "businessPage", currentSearch[i].name, "float: left", [["request_type", "loadBusinessPage"], ["business_id", currentSearch[i].id]]);
                var currText = "<span></span>" + linkToBusiness + "<span style ='float: left; margin-left: 10px'> City: " + businessesList[i].city + "</span><span style ='float: left ; margin-left: 10px'> Number: " + businessesList[i].phone + "</span>";
                $('#resultsPanelBody').append('<div><p style ="float: left">' + currText + '</p></div><br>');
                $('#resultsPanelBody').append('<hr class="hr-soften">');
            }
        }
    }
});