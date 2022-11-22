const fs = require('fs')

/**
 * @typedef {Object} BibliographyEntry
 * @property {'doi'} type
 * @property {string} [doi]
 * @property {boolean} hidden
 * */
/**
 * @typedef {Object} BibliographyRenderedEntry
 * @property {string} id
 * @property {string} locale
 * @property {string} style
 * @property {string} formattedCitation
 * */
/**
 * @typedef {Object} BibliographySettings
 * @property {string} locale
 * @property {string} style
 * */
/**
 * @typedef {Object} module:current.Bibliography
 * @property {{[id: string]: BibliographyEntry}} entries - Data of the single entries
 * @property {Array<BibliographyRenderedEntry>} rendered - Cache for formatted citation of the entries
 * @property {BibliographySettings} settings
 * */

/** @type Bibliography */
let loadedBibliography
let loadedBibliographyFileName = null
if (process.argv[2]) {
    loadedBibliographyFileName = process.argv[2]
    loadedBibliography = JSON.parse(fs.readFileSync(loadedBibliographyFileName, 'utf8'))
}

const defaultBibliography = {
    entries: {},
    rendered: [],
    settings: {
        locale: 'en-GB',
        style: 'apa'
    }
}

function handleCurrentFile(req, res) {
    if (req.method.toLowerCase() === 'get') {
        if (!loadedBibliography) {
            res.statusCode = 404
            return res.end()
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.write(JSON.stringify(loadedBibliography))
            return res.end()
        }
    } else if (req.method.toLowerCase() === 'put') {
        let filename = ''
        req.on('data', (chunk) => filename += chunk)
        req.on('end', () => {
            filename += '.json'
            loadedBibliographyFileName = filename
            if (fs.existsSync(filename)) {
                res.statusCode = 409
                return res.end()
            }
            const emptyData = {...defaultBibliography}
            loadedBibliography = emptyData
            writeFile()
            res.setHeader('Content-Type', 'application/json')
            res.write(JSON.stringify(emptyData))
            return res.end()
        })
    }
}

function handleSettings(req, res) {
    if (req.method.toLowerCase() === 'put') {
        let dataRaw = ''
        req.on('data', (chunk) => dataRaw += chunk)
        req.on('end', () => {
            const data = JSON.parse(dataRaw)
            if (data.locale) {
                loadedBibliography.settings.locale = data.locale
            }
            if (data.style) {
                loadedBibliography.settings.style = data.style
            }
            res.statusCode = 201
            writeFile()
            return res.end()
        })
    }
}

function writeFile() {
    fs.writeFileSync(loadedBibliographyFileName, JSON.stringify(loadedBibliography), 'utf8')
}

/**
 * @param {string} id
 * @param {BibliographyEntry} entry
 * */
function addEntry(id, entry) {
    loadedBibliography.entries[id] = entry
}

/**
 * @param {string} id
 * */
function getEntry(id) {
    return loadedBibliography.entries[id]
}

/**
 * @param {BibliographyRenderedEntry} entry
 * */
function addRenderedEntry(entry) {
    loadedBibliography.rendered.push(entry)
}

module.exports = {handleCurrentFile, handleSettings, writeFile, addEntry, getEntry, addRenderedEntry}
