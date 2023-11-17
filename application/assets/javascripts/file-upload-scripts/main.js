function testFunction() {

    document.getElementById("js EnabledOrDisabled").style.color = "red";
}

if (document.getElementById("jsEnabledOrDisabled").innerHTML === "JS files are currently enabled") {

    var jsToggle = true;
    console.log("js Toggle is: " + String(jsToggle));
}


// document.getElementById("disableJsBtn").addEventListener("click", disableJs);
// document.getElementById("enableJsBtn").addEventListener("click", enableJs);

function disableJs() {

    if (jsToggle === false) {

        return;
    }

    else if (jsToggle === true) {

        jsToggle = false;
        document.getElementById("jsEnabledOrDisabled").style.fontSize = 50;
        document.getElementById("jsEnabledOrDisabled").innerHTML = "JS files are currently disabled";
    }

    else {

        return;
    }
}

function enableJs() {

    if (jsToggle === true) {

        return;
    }

    else if (jsToggle === false) {

        jsToggle = true;
        document.getElementById("jsEnabledOrDisabled").innerHTML = "JS files are currently enabled";

    }

    else {

        return;
    }
}