#! /usr/bin/env node

const open = require('open')
const handler = require('serve-handler')
const http = require('http')
const fs = require('fs')

const cwd = process.cwd()
let loadedBibliography = null
if (process.argv[2])
    loadedBibliography = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))

const server = http.createServer((req, res) => {
    try {
        if (req.url === '/current') {
            if (req.method.toLowerCase() === 'get') {
                if (loadedBibliography === null) {
                    res.statusCode = 404
                    return res.end()
                } else {
                    res.write(JSON.stringify(loadedBibliography))
                    return res.end()
                }
            } else if (req.method.toLowerCase() === 'put') {
                let filename = ''
                req.on('data', (chunk) => filename += chunk)
                req.on('end', () => {
                    filename += '.json'
                    if (fs.existsSync(filename)) {
                        res.statusCode = 409
                        return res.end()
                    }
                    const emptyData = {}
                    loadedBibliography = emptyData
                    const emptyDataString = JSON.stringify(emptyData)
                    fs.writeFileSync(filename, emptyDataString, 'utf8')
                    res.write(emptyDataString)
                    return res.end()
                })
            }
        } else {
            return handler(req, res, {
                public: 'public',
                cleanUrls: true
            })
        }
    } catch (err) {
        console.error(err)
        res.statusCode = 500
        return res.end()
    }
})

const port = 3100
server.listen(port, () => {
    const url = `http://localhost:${port}`
    open(url)
    console.log(`Automatically opening ${url} ...`)
})
