/**
 * Created by Daniel on 19/08/2017.
 */



$(function () {
    getJobsFilter();
    getCities();

    var today = currentDateYYYYMMDD();
    $('#startDate')[0].value = today;
    $('#endDate')[0].value = today;

    loadLatestJobs();

});

function loadLatestJobs() {
    $.ajax({
        url: "FeedServlet",
        type: 'POST',
        data: {
            request_type: "loadLatestJobs"
        },
        success: function (listOfJobs) {
            listOfJobs.forEach(printJobOffer);
        }
    });
}

function currentDateYYYYMMDD() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today;
}

$(document).on('click', '#delete', function () {
    $(this).parent().parent().parent().remove().slideUp();
});

function deleteWall() {
    var siblingToDel = $("#insert").siblings();

    if (siblingToDel.length != 0) {
        siblingToDel.remove();
    }

}

var lastJob;
$(document).on('click', '#buttonFilter', function () {
    //takes care of skills
    var titlesToFilter = 0;
    var startDate = 0;
    var endDate = 0;
    var location = 0;
    var allNull = true;
    var salaryFrom = 0;
    var salaryTo = 0;

    deleteWall();

    if ($("#startDate").val() != "") {
        startDate = $("#startDate").val();
        allNull = false;
    }
    if ($("#endDate").val() != "") {
        endDate = $("#endDate").val();
        allNull = false;
    }

    if ($("#salaryFrom").val() != "") {
        salaryFrom = $("#salaryFrom").val();
        allNull = false;
    }

    if ($("#salaryTo").val() != "") {
        salaryTo = $("#salaryTo").val();
        allNull = false;
    }

    if ($("#locationSelect").chosen().val().length != 0) {
        location = $("#locationSelect").chosen().val();
        allNull = false;
    }

    if ($("#jobsSelect").chosen().val().length != 0) {
        titlesToFilter = $("#jobsSelect").chosen().val();
        allNull = false;
    }

    /*if (startDate != 0 && startDate < currentDateYYYYMMDD()) {
        alert("Can't work in the past");
    }*/
 /*   if (endDate != 0 && endDate < startDate) {
        alert("Can't work to the past");
    }*/

    //saving params for loadMore
    savedParams.titlesToFilter = titlesToFilter;
    savedParams.startDate = startDate;
    savedParams.endDate = endDate;
    savedParams.location = location;
    savedParams.salaryFrom = salaryFrom;
    savedParams.salaryTo = salaryTo;
    savedParams.allNull = allNull;

    $.ajax({
        url: "FeedServlet",
        type: 'POST',
        data: {
            request_type: "getJobsByFilter",
            token_list: titlesToFilter,
            start_date: startDate,
            end_date: endDate,
            job_location: location,
            salary_from: salaryFrom,
            salary_to: salaryTo,
            flag: allNull,
            flagContinue: false
        },
        success: function (listOfJobs) {
            console.log(listOfJobs);
            listOfJobs.forEach(printJobOffer);
            lastJob = listOfJobs[listOfJobs.length - 1];
        }
    });
});


var savedParams = {
    titlesToFilter: 0,
    startDate: 0,
    endDate: 0,
    location: 0,
    salaryFrom: 0,
    salaryTo: 0,
    allNull: true
};

$(document).on('click', '#LoadMore', function () {
    $.ajax({
        url: "FeedServlet",
        type: 'POST',
        data: {
            request_type: "getJobsByFilter",
            token_list: savedParams.titlesToFilter,
            start_date: savedParams.startDate,
            end_date: savedParams.endDate,
            job_location: savedParams.location,
            salary_from: savedParams.salaryFrom,
            salary_to: savedParams.salaryTo,
            flag: savedParams.allNull,
            flagContinue: true,
            lastPostId: lastJob.left.jobId,
            lastPostTime: lastJob.left.postTime
        },
        success: function (listOfJobs) {
            listOfJobs.forEach(printJobOffer);
            lastJob = listOfJobs[listOfJobs.length - 1];
        }
    });
});

function renameFeedId() {
    $("#feed").each(function () {
        var newID = 'feed' + $(this).attr("data-job-id");
        $(this).attr('id', newID);
    });
}

function insertLocationToDropBox(city) {
    $('<option>' + city.engName.toLowerCase() + '</option>').insertAfter("#optionL0");
}

function getCities() {
    cities.forEach(insertLocationToDropBox);
    $("#optionL0").remove();
    $('#locationSelect').chosen();
    $('#locationSelect').chosen({allow_single_deselect: true});
}

function getJobsFilter() {
    $.ajax({
        url: "FeedServlet",
        type: 'GET',
        data: {
            request_type: "getJobsTitleList"
        },
        success: function (listOfJobs) {

            listOfJobs.forEach(insertJobsToDropDown);
            $("#option0").remove();
            $('#jobsSelect').chosen();
            $('#jobsSelect').chosen({allow_single_deselect: true});
        }
    })
}

function insertJobsToDropDown(jobName) {
    $('<option>' + jobName + '</option>').insertAfter("#option0");
}

function printJobOffer(pair) {
    var job = pair.left;
    var business = pair.right;
    var job = pair.left;
    var business = pair.right;
    var linkToBusiness = getLinkWithStyle(business.id + "Form", "businessPage", business.name , "float: left", [["request_type", "loadBusinessPage"], ["business_id", business.id]]);
    var availablePositions = job.max_workers_num - job.workers_num;
    var feed = "Location: " + job.jobLocation + "</br>" +
        "Date: " + job.startDate + " to: " + job.endDate + "</br>" +
        "Salery per houer:" + job.salary + "</br>" +
        "Positions available:" + availablePositions + "/" + job.max_workers_num + "</br>" +
        "Requirements: " + job.requirements + "</br>" +
        "Details:" + job.details+ "</br>";
    var disableApplyButton = "";
    if (availablePositions === 0)
        disableApplyButton = "disabled"
    // language=HTML
    $('\
    <div class="row" id="feed"  data-job-id="' + job.jobId + '">\
            <div style="margin-left: 10px ; max-width: 97%" class="panel panel-default">\
            <div class="panel-heading">\
            <div class="row" >\
                <div align="center" style="font-size:25px;">\
                   <b style="margin-right: 40%; margin-left: 40%;  text-decoration: underline">' + job.name + '</b>\
                   <button align="right" class="btn btn-default btn-md" id="applybtn" data-business-id="'+job.business_id+'" data-job-id="'+job.jobId+'" onclick="applyJobClick(this)" '+ disableApplyButton +'>apply</button>\
                </div>\
            </div>\
            </div>\
            <div class="panel-body">\
                    <div class="col-md-2">\
                        <img style="width:100%; height:100%" id="businessImg" src="">\
                        <div>'+ linkToBusiness +'</div>\
                    </div>\
                    <div class="col-md-10" style="text-align: left;">\
                        <div class="pull-right text-muted" id="delete" style=";font-size: 15px">Hide</div>\
                        <div style=" font-size:20px"> ' + feed + '</div>\
	                    <div class="text-muted" > <small>posted on </small><small>' + job.postDate + '</small></div>\
	                </div>\
	        </div>\
	</div>').insertBefore("#insert").hide().slideDown();
    renameFeedId();
    var newID = "#feed" + job.jobId;
    if (business.profilePicUrl != null) {
        $(newID).find("img").attr("src", business.profilePicUrl);
    }
    else {
        $(newID).find("img").attr("src", 'Resources/empty_profile.jpg');
        //$(newID).find("img").hide();
    }
}

function getCurrentDateAndTIme() {
    var dt = new Date();
    var date = dt.toDateString();
    var min = dt.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var time = dt.getHours() + ":" + min;

    var res = time + " " + date;
    return res;
}

function applyJobClick(btn) {
    $.ajax({
        url: 'FeedServlet',
        type: 'POST',
        data: {
            request_type:"applyToJob",
            applicant_id:currentUserLoggedIn.id,
            job_id:$(btn).attr("data-job-id"),
            business_id:$(btn).attr("data-business-id")
        },
        success: function (data) {
            alert("You applyed to the job");
        }
    });
}
