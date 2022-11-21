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
