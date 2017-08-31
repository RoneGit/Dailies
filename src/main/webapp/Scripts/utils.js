function getLink(formName, action, text, inputsValues) {
    //formName: the name of the form, important for not having ambiguity
    //action: is the servlet urlPatterns
    //test: is the text that will appear on the link
    //inputsValues: ([['request_type','loadBusinessPage],['business_id','1']])
    //              list of lists
    // call example: var link =getLink(u.fname+u.lname+"Form","profilePageServlet",u.fname+" "+u.lname,[["request_type","loadUserProfile"],["user_id",u.id]]);

    var res = '<form class="linkForm" id="' + formName + '" action="' + action + '" method="post">';
    inputsValues.forEach(function (iv) {
        res += '<input type="hidden" name="' + iv[0] + '" value="' + iv[1] + '" />';
    })

    res += '<a href="#" onclick="document.getElementById(\'' + formName + '\').submit();">' + text + '</a>';
    res += '</form>';
    return res;
}

function getLinkWithStyle(formName, action, text,style ,inputsValues) {
    //formName: the name of the form, important for not having ambiguity
    //action: is the servlet urlPatterns
    //test: is the text that will appear on the link
    //inputsValues: ([['request_type','loadBusinessPage],['business_id','1']])
    //              list of lists
    // call example: var link =getLink(u.fname+u.lname+"Form","profilePageServlet",u.fname+" "+u.lname,[["request_type","loadUserProfile"],["user_id",u.id]]);
    console.log("inputsValues :" + inputsValues);

    var res = '<form id="' + formName + '" action="' + action + '" method="post" style="'+ style +'">';
    inputsValues.forEach(function (iv) {
        res += '<input type="hidden" name="' + iv[0] + '" value="' + iv[1] + '" />';
    })

    res += '<a href="#" onclick="document.getElementById(\'' + formName + '\').submit();">' + text + '</a>';
    res += '</form>';
    return res;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profilePicDisplay')
                .attr('src', e.target.result)
                .width(150)
                .height(200);
        };
        reader.readAsDataURL(input.files[0]);
    }
    var picElement = document.getElementById('profilePicDisplay');
    if (picElement.style.visibility === 'hidden') {
        picElement.style.visibility = "visible";
    }
}

function readUrlWithOurHiddenPicture(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profilePicDisplay')
                .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function editJobsClick(id,name) {
    window.location.replace("/editJobs.html?business_id="+id+"&business_name="+name);
}
function formatDateToYYYY_MM_DD(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
    
}

function showProfilePic(profilePicUrl) {
    if (profilePicUrl) {
        $("#profilePicImg").attr("src", profilePicUrl);
    }
    else {
        $("#profilePicImg").attr("src", "Resources/empty_profile.jpg");
    }
}

function showUserProfile(btn) {
    var id =$(btn).attr("data-id");
    window.location.replace("/profilePage.html?user_id=" + id)
}
function showBusinessProfile(btn) {
    var id =$(btn).attr("data-id");
    window.location.replace("/businessProfilePage.html?business_id=" + id)
}