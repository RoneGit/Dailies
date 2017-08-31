/**
 * Created by Daniel on 19/08/2017.
 */

$(function () {
    getJobsFilter();

    var today = currentDateYYYYMMDD();
    $('#startDate')[0].value = today;
    $('#endDate')[0].value = today;
});

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


function checkBoxChange(checkbox) {
    var sibling = checkbox.nextElementSibling;


    if (!(checkbox.checked)) {
        while (sibling) {
            sibling.disabled = true;
            if (sibling.type == "date")
                sibling.value = "";
            if (sibling.id == "jobsSelect_chosen") {
                $('.chosen-resualt').display = "none";
                sibling.firstElementChild.childNodes[1].childNodes[1].readOnly = true;
                // sibling.firstElementChild.nextElementSibling.childNodes[0].display= "none";
            }
            sibling = sibling.nextElementSibling;
        }
    }
    else {
        while (sibling) {
            sibling.disabled = false;
            if (sibling.type == "date")
                sibling.value = currentDateYYYYMMDD();
            if (sibling.id == "jobsSelect_chosen") {
                sibling.firstElementChild.childNodes[1].childNodes[1].readOnly = false;
                sibling.firstElementChild.nextElementSibling.childNodes[0].display = "unset";
            }
            sibling = sibling.nextElementSibling;
        }
    }
}

$(document).on('click', '#delete', function () {
    $(this).parent().parent().parent().remove().slideUp();
});


function removePost(post) {
    post.remove().slideUp();
}

function deleteWall() {
    var siblingToDel = $("#insert").siblings();

    while (siblingToDel) {
        siblingToDel.remove();
    }

}

$(document).on('click', '#buttonFilter', function () {
    //takes care of skills
    var titlesToFilter = 0;
    var startDate = 0;
    var endDate = 0;
    var location = 0;

    //deleteWall();

    if ($("#EnableStartDate")[0].checked) {
        startDate = $("#startDate").val();
    }
    if ($("#EnableEndDate")[0].checked) {
        endDate = $("#endDate").val();
    }
    if ($("#EnableLocation")[0].checked) {
        location = $("#jobLocation").val();
    }
    if ($("#EnableSkills")[0].checked) {
        titlesToFilter = $(".chosen-select").val();
    }

    if (startDate != 0 && startDate < currentDateYYYYMMDD()) {
        alert("Can't work in the past");
    }
    if (endDate != 0 && endDate < startDate) {
        alert("Can't work to the past");
    }
    $.ajax({
        url: "FeedServlet",
        type: 'POST',
        data: {
            request_type: "getJobsByFilter",
            token_list: titlesToFilter,
            start_date: startDate,
            end_date: endDate,
            job_location: location
        },
        success: function (listOfJobs) {
            listOfJobs.forEach(printJobOffer);
        }
    });
});

function loadJob() {
    $.ajax({
        url: "FeedServlet",
        type: 'POST',
        data: {
            request_type: "getLatestJobs"
        },
        success: function (listOfJobs) {
            console.log(listOfJobs);

            listOfJobs.forEach(printJobOffer);
        }
    });
}


function getJobsFilter() {
    $.ajax({
        url: "FeedServlet",
        type: 'GET',
        data: {
            request_type: "getJobsTitleList"
        },
        success: function (listOfJobs) {
            console.log(listOfJobs);

            listOfJobs.forEach(insertJobsToDropDown);
            $("#option0").remove();
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        }
    })
}

function insertJobsToDropDown(jobName) {
    $('<option>' + jobName + '</option>').insertAfter("#option0");
    console.log('x');
}


function printJobOffer(job) {
    var feed = "Location: " + job.jobLocation + "</br>" +
        "Date: " + job.startDate + " to: " + job.endDate + "</br>" +
        "Requirements: " + job.requirements;

    $('<div class="row" id="feed">\
        <div style="margin-left: 10px" class="panel panel-primary">\
        <div class="panel-heading">\
        <div style=";font-size:25px; text-decoration: underline;text-align: center"><b>' + job.name + '</b></div></div>\
        <div class="panel-body">\
        <div class="col-md-12" style="text-align: center;">\
        <div class="pull-right text-muted" id="delete" style=";font-size: 15px">delete</div>\
        <div style=" font-size:20px"> ' + feed + '</div>\
      <div><b>' + job.details + '</b></div>\
      <div class="text-muted" > <small>posted on </small><small>' + job.postDate + '</small></div>\
      </div>\
      <input type="hidden" id="jobId" value="' + job.jobId + '">\
	    <button class="btn btn-primary btn-xs" id="applybtn"  data-business-id="' + job.business_id + '" data-job-id="' + job.jobId + '" onclick="applyJobClick(this)">apply</button>\
      </div></div>').insertAfter("#insert").hide().slideDown();
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
            request_type: "applyToJob",
            job_id: $(btn).attr("data-job-id"),
            business_id: $(btn).attr("data-business-id"),
            owner_id: $(btn).attr("data-owner-id")
        },
        success: function (data) {
            if (data) {
                alert("Applied");
            }
        }
    });

}

