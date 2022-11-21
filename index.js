#! /usr/bin/env node

const open = require('open')
const handler = require('serve-handler')
const http = require('http')
const fs = require('fs')
const {handleCurrentFile} = require('./server/current')
const {handleEntry} = require('./server/entry')

const cwd = process.cwd()

const server = http.createServer((req, res) => {
    try {
        if (req.url === '/current') {
            return handleCurrentFile(req, res)
        } else if (req.url === '/entry') {
            return handleEntry(req, res)
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
