// Custom Error message
async function customAlert(title, info) {
    let errorDiv = $(".error");
    errorDiv.innerHTML = "";

    let alertDiv = CE("div", {
        classList: ["alertDiv"],
        parent: errorDiv
    });

    CE("H3", {
        "innerHTML": title,
        classList: ["alertH3"], 
        parent: alertDiv
        },
    );

    CE("hr", {
        classList: ["alertHr"], 
        parent: alertDiv
    });

    CE("p", {
        "innerHTML": info,
        classList: ["alertP"], 
        parent: alertDiv    
    });

    await wait(3000);
    alertDiv.classList.add("deleting")
    await wait(1000);
    errorDiv.innerHTML = "";
}

// Added for laziness
function log(e){
    console.log(e)
}

// Redirects to a page by taking a string
function redirect(path){
    window.location.replace( window.location.protocol + "//" + window.location.host + "/" + path);
    return true;
}

// Asynchronous timeOut function
async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}

// Function copied from https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
// Generates a 12 digit long alphanumeric string.
function generateUID() {
    return Math.random().toString(36).slice(2)
}

// Creates an element. Added for reducing redundant code.
function CE( type, options ) {
    elem = document.createElement(type);

    // Add all the attributes of the element
    if (options !== undefined){
        for ([key, value] of Object.entries(options)) {
            if (key != "classList" && key != "parent") {
                elem[key] = value;
            }
        }
    }

    cL = options.classList
    
    // Add all the classes of the element
    if (cL !== undefined) elem.classList.add(...cL)

    // Append the element to the provided parent element or document body
    if (options.parent === undefined) parent = document.body
    else parent = options.parent

    parent.appendChild(elem);

    return elem;
}

// Again, I'm extremely fucking lazy
// Dollar sign to replace JQuery
function $( query ) {
    return document.querySelector(query)
}

function AEL( e, type, cbFunction ) {
    if (e) {
        e.addEventListener(type, cbFunction);
    }
    else {
        return
    }
}

// General purpose POST request
async function post(url, headers, data, whatFailed) {
    headers["Content-type"] = "application/json; charset=UTF-8"
    try {
        res = await fetch(url, {
            headers: headers,
            method: "POST",
            body: JSON.stringify(data)
        }).then(res=>res);
        return res;
    }
    catch(err) {
        log(err);
        customAlert(`${whatFailed} Failed", "Check your internet connection and Try Again`)
        return false;
    }
}

function visible(e, visibleBool) {
    if (visibleBool)
        e.style.display = "";
    else
        e.style.display = "none";
}