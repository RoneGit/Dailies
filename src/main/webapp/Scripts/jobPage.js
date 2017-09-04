var jobOBJ;
var business_id;
var business_name;
$(function () {
    var jobId=getUrlParameter("job_id")
    business_id = getUrlParameter("business_id");
    business_name = getUrlParameter("business_name");
    loadProfilePic(business_id);
    if(jobId!='null') {
        $.ajax({
            url: "editBusinessServlet",
            type: 'POST',
            data: {
                request_type: "getJobOfferByID",
                job_id: jobId
            },
            success: function (job) {
                jobOBJ = job;
                printJob3(job);

            }
        });
    }else{
        printNewJob();
        console.log("NewJob");
    }
})
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
function printNewJob(){
    $("#jobInfoPanelHeaderTextDiv").text("New Job");
    $("#jobInfoPanelBody").append('<div id="jobNew"></div>');
    var div = $('#jobNew');
    // language=HTML
    div.append(

        '<div >\n' +
        '    <form id="jobForm" method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="addJobOffer">\n' +
        '        <input type="hidden" name="jobId" value="">\n' +
        '        <input type="hidden" name="business_id" value="'+business_id+'">\n' +
        '        <input type="hidden" name="business_name" value="'+business_name+'">\n' +

        '        <div class="row">\n' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="title" class="form-control" type="text" name="title"\n' +
        '                       placeholder="Title" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobLocation" class="form-control" type="text" name="jobLocation"\n' +
        '                       placeholder="Job Location" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="startDate" class="col-sm-2 control-label">From:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startDate" type="date" name="startDate" value="" required/>\n' +
        '            </div>\n' +
        '            <label for="startTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startTime" type="time" name="startTime" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="endDate" class="col-sm-2 control-label">To:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endDate" type="date" name="endDate" value="" required/>\n' +
        '            </div>\n' +
        '            <label for="endTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endTime" type="time" name="endTime" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobSalary" class="col-sm-2 control-label">Salary:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobSalary" class="form-control" type="text" name="jobSalary"\n' +
        '                       placeholder="Job Location" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobNumOfWorkers" class="col-sm-2 control-label">Workers:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <input id="jobNumOfWorkers" class="form-control" type="text" name="jobNumOfWorkers"\n' +
        '                       placeholder="Workers Needed" value="" required/>\n' +
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
        '</div>\n'
    );
}
function printJob3(job) {
    $("#jobInfoPanelHeaderTextDiv").text(job.name);
    $("#jobInfoPanelBody").append('<div id="job' + job.jobId + '"></div>');
    var div = $('#job' + job.jobId);
    // language=HTML
    div.append(

        '<div id="collapse'+job.jobId+'">\n' +
        '    <form id="jobForm" method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="updateJob">\n' +
        '        <input type="hidden" name="jobId" value="'+job.jobId+'">\n' +
        '        <input type="hidden" name="business_id" value="'+business_id+'">\n' +
        '        <input type="hidden" name="business_name" value="'+business_name+'">\n' +

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
        '                <input id="jobSalary" class="form-control" type="text" name="jobSalary"\n' +
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
        '</div>\n'
    );
    renameTitleAndLocationId();
    getJobsFilter(job.jobId,job.name);
    getCities(job.jobId,job.jobLocation);
}
function saveNewJob() {
    $("#jobForm").submit();
}

function getJobsFilter(jobId,jobName) {
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
            $(newID+"_chosen").find("span").html(jobName);

        }
    })
}
function getCities(jobId,location) {
    var newID = '#jobLocation';
    if(jobId !=-1) {
        newID= newID+jobId;
    }
    //if($(this).attr("data-job-id")){newID=+ $(this).attr("data-job-id");}
    cities.forEach(insertLocationToDropBox);
    $("#optionL0").remove();
    $(newID).chosen();
    $(newID).chosen({allow_single_deselect: true});
    $(newID+"_chosen").find("span").html(location);
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