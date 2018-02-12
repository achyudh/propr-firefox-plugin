var url = window.location.href;
var main_inner_body;
if (url.indexOf('bugzilla') !== -1 && !document.body.className.includes('security')) {
    main_inner_body = document.getElementById('main-inner');
}
else if (url.indexOf('reviewboard') !== -1) {
    main_inner_body = document.getElementById('content');
}
else if (url.indexOf('phabricator') !== -1) {
    main_inner_body = document.getElementById('phabricator-standard-page-body');
}
else if (url.indexOf('github') !== -1) {
    main_inner_body = document.getElementById('discussion_bucket');
}

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
    document.getElementById("submit-button").textContent="Submiting...";

}

function undoButtonAnimation() {
    document.getElementById("submit-button").textContent="Thank you!";
}

function handleError(error) {
    console.log('Error: ${error}');
}

function notifyBackgroundPage() {
    positive_text = document.getElementById('positive-text').value;
    negative_text = document.getElementById('negative-text').value;
    var review_time = document.getElementById('review-time').value;
    var sending = browser.runtime.sendMessage({
        url: url,
        attachment_id: attachment_id,
        bug_id: bug_id,
        positive_text: positive_text,
        negative_text: negative_text,
        review_time: review_time,
        star_count: star_count
    });
    sending.then(undoButtonAnimation, handleError);
}

if (main_inner_body) {

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
    negative_text.setAttribute("style", "width: 100%; height:5em; margin-bottom: 0.5em; margin-top: 0.5em; ");
    negative_text.id = "negative-text";
    main_inner_body.appendChild(negative_text);

    var hr2 = document.createElement('hr');
    main_inner_body.appendChild(hr2);

    var submit_button = document.createElement("button");
    submit_button.id = "submit-button";
    submit_button.setAttribute("style", "float: right;");
    submit_button.innerHTML = "Submit feedback";
    main_inner_body.appendChild(submit_button);

    var attachment_id = getQueryVariable("attachment");
    var bug_id = getQueryVariable("bug");

    var br = document.createElement('br');
    main_inner_body.appendChild(br);

    var star_count = 0;

    document.getElementById('rating3-0').addEventListener('click', function () {
        star_count = 0;
    });

    document.getElementById('rating3-1').addEventListener('click', function () {
        star_count = 1;
    });

    document.getElementById('rating3-2').addEventListener('click', function () {
        star_count = 2;
    });

    document.getElementById('rating3-3').addEventListener('click', function () {
        star_count = 3;
    });

    document.getElementById('rating3-4').addEventListener('click', function () {
        star_count = 4;
    });

    document.getElementById('rating3-5').addEventListener('click', function () {
        star_count = 5;
    });

    submit_button.addEventListener('click', function () {
        buttonAnimation();
        notifyBackgroundPage();
    });
}

