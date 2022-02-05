// Added for laziness
function log(e){
    console.log(e)
}

// Redirects to a page by taking a string
function redirect(path){
    window.location.replace( window.location.protocol + "//" + window.location.host + "/" + path);
    return true;
}


// Creates an element. Added for reducing redundant code.
function CE( type, options, ...children ) {
    elem = document.createElement(type);

    // Add all the attributes of the element
    if (options !== undefined){
        for ([key, value] of Object.entries(options)) {
            if (key != "classList" && key != "parent" && key != "style") {
                elem[key] = value;
            }
        }
    }

    for (child of children)
        elem.appendChild(child);

    let cL = options.classList
    let parent = options.parent
    let style = options.style
    
    // Add all the classes of the element
    if (cL !== undefined) elem.classList.add(...cL)

    // Append the element to the provided parent element or document body
    if (parent !== undefined) parent.appendChild(elem);

    if (style !== undefined) {
        for ([key, value] of Object.entries(style)) {
            elem.style[key] = value;
        }
    }

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
async function request(url, requestType, headers, data) {
    if (requestType != "GET") headers["Content-type"] = "application/json; charset=UTF-8"
    options = {
        headers: headers,
        method: requestType,
        body: JSON.stringify(data)
    }
    if (requestType == "GET") delete options.body
    
    
    try {
        res = await fetch(url, options)
        .then(res => res);  
        
        // Status codes other than 200: Ok, 201: Created
        if (res.status > 201 && res.status <= 511) {
            err = await res.json()
            alert(res.statusText, err.detail)
            return null;
        }

        return res;
    }
    catch(err) {
        log(err)
        alert('Something Went Wrong', 'Check your internet connection and Try Again')
        return null;
    }
}