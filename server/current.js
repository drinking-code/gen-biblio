const fs = require('fs')

/**
 * @typedef {Object} BibliographyEntry
 * @property {'doi'} type
 * @property {string} [doi]
 * */
/**
 * @typedef {Object} BibliographyRenderedEntry
 * @property {string} id
 * @property {string} locale
 * @property {string} style
 * @property {string} formattedCitation
 * */
/**
 * @typedef {Object} module:current.Bibliography
 * @property {{[id: string]: BibliographyEntry}} entries
 * @property {Array<BibliographyRenderedEntry>} rendered
 * */

/** @type Bibliography */
let loadedBibliography = null
let loadedBibliographyFileName = null
if (process.argv[2]) {
    loadedBibliographyFileName = process.argv[2]
    loadedBibliography = JSON.parse(fs.readFileSync(loadedBibliographyFileName, 'utf8'))
}

function handleCurrentFile(req, res) {
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
            loadedBibliographyFileName = filename
            if (fs.existsSync(filename)) {
                res.statusCode = 409
                return res.end()
            }
            const emptyData = {
                entries: {},
                rendered: [],
            }
            loadedBibliography = emptyData
            writeFile()
            res.write(JSON.stringify(emptyData))
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
 * @param {BibliographyRenderedEntry} entry
 * */
function addRenderedEntry(entry) {
    loadedBibliography.rendered.push(entry)
}

module.exports = {handleCurrentFile, writeFile, addEntry, addRenderedEntry}
