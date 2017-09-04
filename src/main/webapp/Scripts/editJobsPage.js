var business_id;
var business_name;

$(function () {
    business_id = getUrlParameter("business_id");
     business_name = getUrlParameter("business_name");
    getJobOffers(printJobsList, business_id, business_name);
    loadProfilePic(business_id);
    loadLogedInUserFriends();
    getFriendsList(addFriendsToMultiSelectionDropDown);


});

function addFriendsToMultiSelectionDropDown(item) {
    var friend = item.left;
    console.log("friends:");
    console.log(friend);
    var option = "<option id=" + friend.id + ">" + friend.fname + " " + friend.lname + "</option>"
    $("#friendsSelect").append(option);
    $("#friendsSelect").trigger("chosen:updated");
}

function getFriendsList(handleData) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getFriends"},
        success: function (friendListWithLogedInData) {
            friendListWithLogedInData.forEach(handleData);
        }
    });
}

function loadProfilePic(business_id) {

    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            business_id: business_id
        },
        success: function (_businessInfo) {
            showProfilePic(_businessInfo.profilePicUrl);
        }
    });

}

function getJobOffers(handleObj, id, name) {

    $("#editJobPanelHeaderTitle").text(name + " Jobs:");
    $("#jobsPanelBody").empty();
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessJobOffers",
            business_id: id
        },
        success: function (_jobOffers) {
            console.log(_jobOffers);
              handleObj(_jobOffers);
        }
    });
}


function printJobsList(jobs) {
    jobs.forEach(printJob2);
}


function deleteJobById(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "deleteJobById",
            job_id:id
        },
        success: function (flag) {
            if(flag==0){
                console.log("fail");
            }else {
                $("#job"+id).remove();
                console.log("success");

            }
        }
    });
}

function deleteJob(id) {
    id = id == null ? $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3) : id;
    if (confirm("Are You Sure You Want To Delete?") == true) {
        deleteJobById(id);
    } else {
        console.log("You pressed Cancel!");
    }
}

function selectThis(elem) {
    $(elem).addClass(" selectedOfer");
    $(elem).siblings().removeClass("selectedOfer");
    $("#editJobItem").removeClass("disabled");
    $("#deleteJobItem").removeClass("disabled");
    $("#sendEmploymentReqItem").removeClass("disabled");


}

function printJob2(job) {
    $("#jobsPanelBody").append('<div id="job' + job.jobId + '" onclick="selectThis(this)"></div>');
    var div = $("#job" + job.jobId);

    // language=HTML
    div.append(
        '<a href="#collapse' + job.jobId + '" data-toggle="collapse">' + job.name + '</a>' +
        '<span style="float:right;" class="col-md-5">Posted On: <small>' + job.postDate + ' on ' + job.postTime + '</small></span>\n' +
        '<div id="collapse' + job.jobId + '" class="collapse">\n' +
        '<div class="row"><label class="control-label col-sm-2">Location: </label>' + job.jobLocation + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">From: </label>' + job.startDate + '  ' + job.startTime + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">To: </label>' + job.endDate + ' ' + job.endTime + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Salary: </label>' + job.salary + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Workers: </label>' + job.workers_num +'/'+job.max_workers_num+ '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Details: </label>' + job.details + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Requirements: </label>' + job.requirements + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Applicants: </label>' + '<div id="applicantsListDiv"></div>' + '</div>' +
        '</div>');
    $("#jobsPanelBody").append('<hr class="hr-soften">');
    console.log(job);
    /*applicantList.forEach(function (applicant) {

        if(applicant!=null) {
            console.log("applicant: "+applicant.id);
            var userLink = getLinkWithStyle(applicant.id + "feedbackForm", "profilePageServlet", applicant.fname+" "+applicant.lname +"  ","col-md-offset-1", [["request_type", "loadUserProfile"], ["user_id", applicant.id]]);

            $("#job" + job.jobId).find("#applicantsListDiv").append(userLink);
        }
    });*/
}

function printJob3(job) {
    $("#jobsPanelBody").append('<div id="job' + job.jobId + '"></div>');
    var div = $('#job' + job.jobId);
    // language=HTML
    div.append(
        '<a href="#collapse'+job.jobId+'" data-toggle="collapse">'+job.name+'</a><span style="float:right;" class="col-md-5">Posted On: <small>'+job.postDate+' on '+job.postTime+'</small></span>\n' +

        '<div id="collapse'+job.jobId+'" class="collapse">\n' +
        '    <form  method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="updateJob">\n' +
        '        <input type="hidden" name="jobId" value="'+job.jobId+'">\n' +
        '        <input type="hidden" name="business_id" value="'+business_id+'">\n' +
        '        <input type="hidden" name="business_name" value="'+business_name+'">\n' +

        '        <div class="row">\n' +
        '            <div class="col-md-3"></div>\n' +
        '            <div class="col-md-3 "><input type="submit" value="Save" class="btn btn-primary btn-outline btn-xs"/></div>\n' +
        '            <div class="col-md-3"><input type="button" value="Delete" class="btn btn-danger btn-outline btn-xs" onclick="deleteJob('+job.jobId+')"/></div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="title" data-placeholder="'+ job.name +'" data-job-id="' + job.jobId + '" name="title"'+
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                     <option id="option0"></option>' +
        '                 </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="jobLocation" data-placeholder="'+job.jobLocation+'" data-job-id="' + job.jobId + '" name="jobLocation"\n' +
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                       <option id="optionL0"></option>' +
        '                </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="startDate" class="col-sm-2 control-label">From:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startDate" type="date" name="startDate" value="'+formatDateToYYYY_MM_DD(job.startDate)+'" required/>\n' +
        '            </div>\n' +
        '            <label for="startTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startTime" type="time" name="startTime" value="'+job.startTime+'" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="endDate" class="col-sm-2 control-label">To:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endDate" type="date" name="endDate" value="'+formatDateToYYYY_MM_DD(job.endDate)+'" required/>\n' +
        '            </div>\n' +
        '            <label for="endTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endTime" type="time" name="endTime" value="'+job.endTime+'" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobSalary" class="col-sm-2 control-label">Salary:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobSalary" class="form-control" type="number" min="0" name="jobSalary"\n' +
        '                       placeholder="Salary" value="'+job.salary+'" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobNumOfWorkers" class="col-sm-2 control-label">Workers:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobNumOfWorkers" class="form-control" type="text" name="jobNumOfWorkers"\n' +
        '                       placeholder="Workers Needed" value="'+job.max_workers_num+'" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="details" class="col-sm-2 control-label">Job details:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="details" name="details"\n' +
        '                      placeholder="Job details">'+job.details+'</textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row ">\n' +
        '            <label for="requirements" class="col-sm-2 control-label">Requirements:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="requirements" name="requirements"\n' +
        '                      placeholder="Requirements">'+job.requirements+'</textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '</div>\n' +
        '<hr class="hr-soften">'
    );
    renameTitleAndLocationId();
    getJobsFilter(job.jobId);
    getCities(job.jobId);
}

function cancelNewJobClick() {
    $("#job-newjob-").remove();
    $("#addJobBtn").attr("disabled", false);
    console.log("cancelNewJobClick");
}

function addJobOffer() {

    window.location.replace(String.format("jobPage.html?job_id={0}&business_id={1}&business_name={2}",null,business_id,business_name));
    /*$("#addJobBtn").attr("disabled", true);
    console.log("addJobOffer");

    $("#jobsPanelBody").prepend('<div id="job-newjob-"></div>');
    var div = $("#job-newjob-");

    // language=HTML
    div.append(

        '<div >\n' +
        '    <form  method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="addJobOffer">\n' +

        '        <input type="hidden" name="business_id" value="'+business_id+'">\n' +
        '        <input type="hidden" name="business_name" value="'+business_name+'">\n' +

        '        <div class="row">\n' +
        '            <div class="col-md-3"></div>\n' +
        '            <div class="col-md-3 "><input type="submit" value="Save" class="btn btn-primary btn-outline btn-xs"/></div>\n' +
        '            <div class="col-md-3"><input type="button" value="Cancel" class="btn btn-danger btn-outline btn-xs" onclick="cancelNewJobClick()"/></div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="title" data-placeholder="Click To Select Your Skills" name="title"'+
        '                      class="chosen-select chosen-ltr form-control" required>\n' +
        '                   <option id="option0"></option>' +
        '                 </select>' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="jobLocation" data-placeholder="Click To Select Location" name="jobLocation"\n' +
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                   <option id="optionL0"></option>' +
        '                </select>' +
        '           </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="startDate" class="col-sm-2 control-label">From:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startDate" type="date" name="startDate"  required/>\n' +
        '            </div>\n' +
        '            <label for="startTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startTime" type="time" name="startTime"  required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="endDate" class="col-sm-2 control-label">To:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endDate" type="date" name="endDate"  />\n' +
        '            </div>\n' +
        '            <label for="endTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endTime" type="time" name="endTime" />\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobSalary" class="col-sm-2 control-label">Salary:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobSalary" class="form-control" type="number" min="0" name="jobSalary"\n' +
        '                       placeholder="Job Salary"  required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobNumOfWorkers" class="col-sm-2 control-label">Workers:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobNumOfWorkers" class="form-control" type="text" name="jobNumOfWorkers"\n' +
        '                       placeholder="Workers Needed"  required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="details" class="col-sm-2 control-label">Job details:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="details" name="details"\n' +
        '                      placeholder="Job details"></textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row ">\n' +
        '            <label for="requirements" class="col-sm-2 control-label">Requirements:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="requirements" name="requirements"\n' +
        '                      placeholder="Requirements"></textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '</div>\n' +
        '<hr class="hr-soften">');
    getJobsFilter();
    getCities();*/
}
function editJobOffer() {
    var jobId = $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3);
    window.location.replace(String.format("jobPage.html?job_id={0}&business_id={1}&business_name={2}", jobId, business_id, business_name));
}

function sendEmploymentRequests() {
    var friendsNames;
    var friendsIds = [];
    var jobId = $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3);
    if ($("#friendsSelect").chosen().val().length != 0) {
        friendsNames = $("#friendsSelect").chosen().val();
        friendsNames.forEach(function (f) {
            friendsIds.push($("option:contains('" + f + "')").prop('id'));
            console.log($("option:contains('" + f + "')").prop('id'));
        })
        allNull = false;
    }

    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "sendEmploymentRequests",
            friends: friendsIds,
            business_id:business_id,
            job_id:jobId,
            sender_id:currentUserLoggedIn.id
        },
        success: function () {
            $('#myModal').modal('toggle');

        }
    });
}
function getJobsFilter(jobId) {
    $.ajax({
        url: "FeedServlet",
        type: 'GET',
        data: {
            request_type: "getJobsTitleList"
        },
        success: function (listOfJobs) {
            var newID = '#title';
            if(jobId !=-1) {
                newID=newID+jobId;
            }
            listOfJobs.forEach(insertJobsToDropDown);
            $("#option0").remove();
            $(newID).chosen();
            $(newID).chosen({allow_single_deselect: true});
        }
    })
}
function getCities(jobId) {
    var newID = '#jobLocation';
    if(jobId !=-1) {
        newID= newID+jobId;
    }
    //if($(this).attr("data-job-id")){newID=+ $(this).attr("data-job-id");}
    cities.forEach(insertLocationToDropBox);
    $("#optionL0").remove();
    $(newID).chosen();
    $(newID).chosen({allow_single_deselect: true});
}

function insertLocationToDropBox(city) {
    $('<option>' + city.engName.toLowerCase() + '</option>').insertAfter("#optionL0");
}
function insertJobsToDropDown(jobName) {
    $('<option>' + jobName + '</option>').insertAfter("#option0");
}

function renameTitleAndLocationId() {
    $("#title").each(function () {
        var newID = 'title' + $(this).attr("data-job-id");
        $(this).attr('id', newID);
    });

    $("#jobLocation").each(function () {
        var newID = 'jobLocation' + $(this).attr("data-job-id");
        $(this).attr('id', newID);
    });
}
