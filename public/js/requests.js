function genericRequest(url, options = {}, statusCodeCallbacks = {}) {
    statusCodeCallbacks = {
        200: res => res.json(),
        201: () => 0,
        'default': () => alert('Something went wrong :('),
        ...statusCodeCallbacks
    }
    return fetch(url, options)
        .catch(err => 0)
        .then(async res => {
            if (statusCodeCallbacks[res.status])
                return await statusCodeCallbacks[res.status](res)
            else if (statusCodeCallbacks.default)
                return await statusCodeCallbacks.default(res)
            if (res.status === 200) {
                return await res.json()
            } else if (res.status === 409) {
                alert('This file already exists. Please delete it first, or choose a different name.')
            } else {
                alert('Something went wrong :(')
            }
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

function addEntry({id, doi, style, locale}) {
    return genericRequest('/entry', {
        method: 'put',
        body: JSON.stringify({
            type: 'doi',
            doi, style, locale, id
        })
    })
}

function getFormattedEntry({id, style, locale}) {
    return genericRequest('/entry', {
        body: JSON.stringify({style, locale, id})
    })
}

function sendSetting(setting, value) {
    return genericRequest('/settings', {
        method: 'put',
        body: JSON.stringify({[setting]: value})
    })
}
