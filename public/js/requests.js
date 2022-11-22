function genericRequest(url, options = {}, statusCodeCallbacks = {}) {
    statusCodeCallbacks = {
        200: res => res.json(),
        201: () => 0,
        'default': () => alert('Something went wrong :('),
        ...statusCodeCallbacks
    }
    options = {
        ...options,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            ...options.headers,
        },
    }
    return fetch(url, options)
        .catch(err => console.error(err))
        .then(async res => {
            if (statusCodeCallbacks[res.status])
                return await statusCodeCallbacks[res.status](res)
            else if (statusCodeCallbacks.default)
                return await statusCodeCallbacks.default(res)
        })
}

function createFile(name) {
    return genericRequest('/current', {
        method: 'put',
        body: name
    }, {
        409: () => alert('This file already exists. Please delete it first, or choose a different name.'),
    })
}

function getFile(onNoFile) {
    return genericRequest('/current', {}, {'default': onNoFile})
}

function addEntry({id, doi, hidden, style, locale}) {
    return genericRequest('/entry', {
        method: 'put',
        body: JSON.stringify({
            type: 'doi',
            id, style, locale,
            doi, hidden
        })
    })
}

function updateEntry({id, hidden}) {
    return genericRequest('/entry', {
        method: 'PATCH',
        body: JSON.stringify({
            id,
            hidden
        })
    })
}

function getFormattedEntry({id, style, locale}) {
    return genericRequest(`/entry/${id}`, {
        headers: {
            'Accept-Locale': locale,
            'Accept-Style': style,
        },
    })
}

function sendSetting(setting, value) {
    return genericRequest('/settings', {
        method: 'put',
        body: JSON.stringify({[setting]: value})
    })
}
