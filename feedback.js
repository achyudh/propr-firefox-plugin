var main_inner_body = document.getElementById('main-inner');

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        Number(value) > -1 &&
        !isNaN(parseInt(value, 10));
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable){ return pair[1]; }
    }
    return(false);
}

function buttonAnimation() {
    document.getElementById("submit-button").style.background="#4d85d1";
    document.getElementById("submit-button").textContent="Thank you!";
}

function sendToDB(star_count) {
    var url = window.location.href;
    var attachment_id = getQueryVariable("attachment");
    var bug_id = getQueryVariable("bug");
    var positive_text = document.getElementById('positive-text').value;
    var negative_text = document.getElementById('negative-text').value;
    var review_time = document.getElementById('review-time').value;
    if (bug_id == null || attachment_id == null) {
        window.alert('ERROR: Invalid reference to Bugzilla patch!');
    }
    // Send feedback DATA as POST request to server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://chennai.ewi.tudelft.nl:60002/submit", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "action": "bugzilla_feedback",
        "url": url,
        "attachment_id":  attachment_id,
        "bug_id": bug_id,
        "positive_comments": positive_text,
        "negative_comments": negative_text,
        "rating": star_count,
        "review_time": review_time
    }));
}

var hr1 = document.createElement('hr');
main_inner_body.appendChild(hr1);

var rating_fieldset = document.createElement('fieldset');
rating_fieldset.innerHTML = "<span class=\"star-cb-group\">\n" +
    "                  <input type=\"radio\" id=\"rating3-5\" name=\"rating3\" value=\"5\" /><label for=\"rating3-5\">5</label>\n" +
    "                  <input type=\"radio\" id=\"rating3-4\" name=\"rating3\" value=\"4\" /><label for=\"rating3-4\">4</label>\n" +
    "                  <input type=\"radio\" id=\"rating3-3\" name=\"rating3\" value=\"3\" /><label for=\"rating3-3\">3</label>\n" +
    "                  <input type=\"radio\" id=\"rating3-2\" name=\"rating3\" value=\"2\" /><label for=\"rating3-2\">2</label>\n" +
    "                  <input type=\"radio\" id=\"rating3-1\" name=\"rating3\" value=\"1\" /><label for=\"rating3-1\">1</label>\n" +
    "                  <input type=\"radio\" id=\"rating3-0\" name=\"rating3\" value=\"0\" class=\"star-cb-clear\" /><label for=\"rating3-0\">0</label>\n" +
    "                </span>\n";
main_inner_body.appendChild(rating_fieldset);

var rating_caption = document.createElement('p');
rating_caption.setAttribute("style", 'text-align: center;');
rating_caption.innerHTML = '<i>How would you rate the <b>reviewability</b> of this patch?</i>';
main_inner_body.appendChild(rating_caption);

var time_div = document.createElement('div');
time_div.innerHTML = "      <form>\n" +
    "                           <b>How long did you take to review this patch?<b>\n <br>" +
    "                           <input id=\"review-time\" type=\"number\" placeholder=\"Number of minutes\" min=\"0\" " +
    "                           onkeypress=\"return event.keyCode != 13;\" style=\"margin-bottom: 0.5em; margin-top: 0.5em;\">\n" +
    "                       </form>";
main_inner_body.appendChild(time_div);

var positive_caption = document.createElement('b');
positive_caption.innerHTML = 'What aspects of this patch, if any, contribute to its reviewability?';
main_inner_body.appendChild(positive_caption);

var positive_text = document.createElement('textarea');
positive_text.setAttribute("style", "width: 100%; height:5em; margin-bottom: 0.5em; margin-top: 0.5em;");
positive_text.id = "positive-text";
main_inner_body.appendChild(positive_text);

var negative_caption = document.createElement('b');
negative_caption.innerHTML = 'What aspects of this patch, if any, should be improved to enhance its reviewability?';
main_inner_body.appendChild(negative_caption);

var negative_text = document.createElement('textarea');
negative_text.setAttribute("style", "width: 100%; height:5em; margin-bottom: 0.5em; margin-top: 0.5em;");
negative_text.id = "negative-text";
main_inner_body.appendChild(negative_text);

var hr2 = document.createElement('hr');
main_inner_body.appendChild(hr2);

var submit_button = document.createElement("button");
submit_button.id = "submit-button";
submit_button.setAttribute("style", "float: right;");
submit_button.innerHTML = "Submit feedback";
main_inner_body.appendChild(submit_button);

var star_count = 0;
$('[name*="rating3"]').change(function () {
    var me = $(this);
    star_count = me.attr('value');
});

document.getElementById('submit-button').addEventListener('click', function () {
    var review_time_text = document.getElementById('review-time').value;
    if (isInt(review_time_text, 10) || review_time_text === "") {
        buttonAnimation();
        sendToDB(star_count);
    }
    else
        alert("Please enter a number (in minutes) for review time.")
});
