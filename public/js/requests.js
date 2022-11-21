function createFile(name) {
    return fetch('/current', {
        method: 'put',
        body: name
    })
        .catch(err => 0)
        .then(async res => {
            if (res.status === 200) {
                return await res.json()
            } else if (res.status === 409) {
                alert('This file already exists. Please delete it first, or choose a different name.')
            } else {
                alert('Something went wrong :(')
            }
        })
}

function getFile(onNoFile) {
    return fetch('/current')
        .catch(err => 0)
        .then(async res => {
            if (res.status !== 200) {
                onNoFile()
            }
            return await res.json()
        })
}

// todo: mae generic request function

function addEntry({id, doi, style, locale}) {
    return fetch('/entry', {
        method: 'put',
        body: JSON.stringify({
            type: 'doi',
            doi, style, locale, id
        })
    })
        .catch(err => 0)
        .then(async res => {
            if (res.status === 200) {
                return await res.json()
            } else {
                alert('Something went wrong :(')
            }
        })
}

function getFormattedEntry({id, style, locale}) {
    return fetch('/entry', {
        method: 'get',
        body: JSON.stringify({style, locale, id})
    })
        .catch(err => 0)
        .then(async res => {
            if (res.status === 200) {
                return await res.json()
            } else {
                alert('Something went wrong :(')
            }
        })
}
