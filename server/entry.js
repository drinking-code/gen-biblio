const {writeFile, addEntry, addRenderedEntry, getEntry} = require('./current')

async function handleEntry(req, res) {
    if (req.method.toLowerCase() === 'put') {
        let bodyRaw = ''
        req.on('data', (chunk) => bodyRaw += chunk)
        req.on('end', async () => {
            const body = JSON.parse(bodyRaw)
            if (body.type === 'doi') {
                const responseData = {}
                responseData.formattedCitation = await getFormattedCitationFromDOI(body.doi, body.id, body.style, body.locale)

                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify(responseData))

                addEntry(body.id, {
                    type: body.type,
                    doi: body.doi.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, '$3'),
                    hidden: body.hidden || false
                })
                writeFile()

                return res.end()
            }
        })
    } else if (req.method.toLowerCase() === 'get') {
        const id = req.url.replace('/entry/', '')
        const locale = req.headers['Accept-Locale'.toLowerCase()]
        const style = req.headers['Accept-Style'.toLowerCase()]
        const entry = getEntry(id)
        if (!entry) {
            res.statusCode = 404
            return res.end()
        }
        const responseData = {}
        responseData.formattedCitation = await getFormattedCitationFromDOI(entry.doi, id, style, locale)

        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(responseData))
        return res.end()
    } else if (req.method.toLowerCase() === 'patch') {
        let dataRaw = ''
        req.on('data', (chunk) => dataRaw += chunk)
        req.on('end', () => {
            const data = JSON.parse(dataRaw)
            const entry = getEntry(data.id)
            if (data.hidden)
                entry.hidden = data.hidden
            writeFile()
            res.statusCode = 201
            return res.end()
        })
    }
}

function getFormattedCitationFromDOI(doi, id, style, locale) {
    doi = doi.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, 'https://doi.org/$3')
    return fetch(doi, {
        headers: {
            'Accept': `text/x-bibliography; style=${style}; locale=${locale}`
        }
    })
        .catch(err => console.log("Unable to fetch -", err))
        .then(async response => {
            if (response.status !== 200) return false
            const formattedCitation = await response.text()

            addRenderedEntry({id, locale, style, formattedCitation})
            writeFile()
            return formattedCitation
        })
}

module.exports = {handleEntry}
