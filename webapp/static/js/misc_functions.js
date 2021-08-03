//? Custom Error message
async function customAlert(title, info) {
    let alertDiv = document.createElement("div");
    alertDiv.classList.add("alertDiv");
    // document.body.appendChild(alertDiv);
    document.body.appendChild(alertDiv);

    alertH3 = document.createElement("H3");
    alertH3.innerHTML = title;
    alertH3.classList.add("alertH3");
    alertDiv.appendChild(alertH3);

    hr = document.createElement("hr");
    hr.classList.add("alertHr")
    alertDiv.appendChild(hr)

    alertInfo = document.createElement("p");
    alertInfo.innerHTML = info;
    alertInfo.classList.add("alertP");
    alertDiv.appendChild(alertInfo);

    await wait(3000);
    alertDiv.classList.add("deleting")
    await wait(1000);
    // document.body.removeChild(alertDiv)
    document.body.removeChild(alertDiv)
}

//? Added for laziness
function pr(e){
    console.log(e)
}

//? Redirects to a page by taking a string
function redirect(path){
    window.location.replace( window.location.protocol + "//" + window.location.host + "/" + path);
    return true;
}

//? Asynchronous timeOut function
async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}

//? Function copied from https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
//? Generates a 12 digit long alphanumeric string.
function generateUID() {
    return Math.random().toString(36).slice(2)
}

//? Creates an element. Added for reducing redundant code.
function customCreateElement( type, options ) {
    elem = document.createElement(type);
    for ([key, value] of Object.entries(options)) {
        if (key!=="classList"){
            elem[key] = value;
        }
    }
    if (options["classList"]!== undefined){
        for (_class of options["classList"]) {
            elem.classList.add(_class);
        }
    }
    return elem;
}

//? Again, I'm extremely fucking lazy
//? Dollar sign to replace JQuery
function $( query ) {
    return document.querySelector(query)
}