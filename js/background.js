function getXMLHttp(){
    try {
        return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
    }
    catch(evt){
        return new XMLHttpRequest();
    }
}

function sendToDB(url, attachment_id, bug_id, positive_text, negative_text, review_time, star_count) {
    if (bug_id == null || attachment_id == null) {
        window.alert('ERROR: Invalid reference to Bugzilla patch!');
    }
    // Send feedback DATA as POST request to server
    var xhr = getXMLHttp();
    xhr.open("POST", "http://chennai.ewi.tudelft.nl:60002/submit", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "action": "moz_feedback",
        "url": url,
        "attachment_id":  attachment_id,
        "bug_id": bug_id,
        "positive_comments": positive_text,
        "negative_comments": negative_text,
        "rating": star_count,
        "review_time": review_time
    }));
    console.log(xhr.responseText);
}

function handleMessage(request, sender, sendResponse) {
    console.log("Message from the content script:" + request.url);
    sendToDB(request.url, request.attachment_id, request.bug_id, request.positive_text, request.negative_text,
        request.review_time, request.star_count);
    sendResponse({response: "Data sent to server"});
}

browser.runtime.onMessage.addListener(handleMessage);