const {writeFile, addEntry, addRenderedEntry} = require('./current')

function handleEntry(req, res) {
    if (req.method.toLowerCase() === 'put') {
        let bodyRaw = ''
        req.on('data', (chunk) => bodyRaw += chunk)
        req.on('end', async () => {
            const body = JSON.parse(bodyRaw)
            if (body.type === 'doi') {
                body.doi = body.doi.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, 'https://doi.org/$3')
                const responseData = {}
                await fetch(body.doi, {
                    headers: {
                        'Accept': `text/x-bibliography; style=${body.style}; locale=${body.locale}`
                    }
                }).then(async response => {
                    responseData.formattedCitation = await response.text()
                }).catch(err => console.log("Unable to fetch -", err))

                res.write(JSON.stringify(responseData))

                addEntry(body.id, {
                    type: body.type,
                    doi: body.doi,
                })
                addRenderedEntry({
                    id: body.id,
                    locale: body.locale,
                    style: body.style,
                    formattedCitation: responseData.formattedCitation
                })
                writeFile()

                return res.end()
            }
        })
    }
}

module.exports = {handleEntry}
