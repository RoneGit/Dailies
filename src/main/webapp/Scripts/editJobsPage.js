var business_id;
var business_name;

$(function () {
    business_id = getUrlParameter("business_id");
     business_name = getUrlParameter("business_name");
    getJobOffers(printJobsList, business_id, business_name);
    loadProfilePic(business_id);
});

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

    $("#jobsPanelHeaderTitle").text(name + " Jobs:");
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
    jobs.forEach(printJob3);
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
    if (confirm("Are You Sure You Want To Delete?") == true) {
        deleteJobById(id);
    } else {
        console.log("You pressed Cancel!");
    }
}
function printJob3(job) {
    $("#jobsPanelBody").append('<div id="job' + job.jobId + '"></div>');
    var div = $('#job' + job.jobId);
    // language=HTML
    div.append(
        '<a href="#collapse'+job.jobId+'" data-toggle="collapse">'+job.name+'</a><span style="position: absolute;right:0;" class="col-md-5">Posted On: <small>'+job.postDate+' on '+job.postTime+'</small></span>\n' +

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
        '                <input id="title" class="form-control" type="text" name="title"\n' +
        '                       placeholder="Title" value="'+job.name+'" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobLocation" class="form-control" type="text" name="jobLocation"\n' +
        '                       placeholder="Job Location" value="'+job.jobLocation+'" required/>\n' +
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
}

function cancelNewJobClick() {
    $("#job-newjob-").remove();
    $("#addJobBtn").attr("disabled", false);
    console.log("cancelNewJobClick");

}
function addJobOffer() {
    $("#addJobBtn").attr("disabled", true);
    console.log("addJobOffer");

    $("#jobsPanelBody").prepend('<div id="job-newjob-"></div>');
    var div = $("#job-newjob-");
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
        '                <input id="title" class="form-control" type="text" name="title"\n' +
        '                       placeholder="Title"  required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobLocation" class="form-control" type="text" name="jobLocation"\n' +
        '                       placeholder="Job Location"  required/>\n' +
        '            </div>\n' +
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

}

