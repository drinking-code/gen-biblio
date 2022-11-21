#! /usr/bin/env node

const open = require('open')
const handler = require('serve-handler')
const http = require('http')
const path = require('path')
const fs = require('fs')
const {handleCurrentFile} = require('./server/current')
const {handleEntry} = require('./server/entry')

const cwd = process.cwd()

const publicFolder = (() => {
    let dirname = path.dirname((new URL('file://' + __filename)).pathname)
    while (!fs.readdirSync(dirname).includes('package.json'))
        dirname = path.join(dirname, '..')
    const publicInNodeModulesPath = path.join(dirname, 'node_modules', 'gen-biblio', 'public')
    if (fs.existsSync(publicInNodeModulesPath))
        return publicInNodeModulesPath
    else
    return path.join(dirname, 'public')
})()

const server = http.createServer((req, res) => {
    try {
        if (req.url === '/current') {
            return handleCurrentFile(req, res)
        } else if (req.url === '/entry') {
            return handleEntry(req, res)
        } else {
            return handler(req, res, {
                public: publicFolder,
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
