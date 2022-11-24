const path = require('path')
const fs = require('fs')
const CSL = require('citeproc')

const styleDir = 'styles'
const langDir = 'lang'
if (!fs.existsSync(styleDir))
    fs.mkdirSync(styleDir)
if (!fs.existsSync(langDir))
    fs.mkdirSync(langDir)

async function cache(filename, callback) {
    if (fs.existsSync(filename)) {
        return await fs.promises.readFile(filename, 'utf8')
    }
    const result = await callback()
    await fs.promises.writeFile(filename, result, 'utf8')
    return result
}

async function getStyle(style) {
    const filename = path.join(styleDir, style + '.csl')
    const request = async () => await fetch('https://raw.githubusercontent.com/citation-style-language/styles/master/' + style + '.csl')
        .then(res => res.text())
    return await cache(filename, request)
}

async function getLang(locale) {
    const filename = path.join(langDir, locale + '.xml')
    const request = async () => await fetch('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-' + locale + '.xml')
        .then(res => res.text())
    return await cache(filename, request)
}

async function styleWith(data, style, locale) {
    const styleAsText = await getStyle(style)
    const langAsText = await getLang(locale)
    const citeproc = new CSL.Engine({
        retrieveLocale: (lang) => langAsText,
        retrieveItem: (id) => data,
    }, styleAsText, locale)
    citeproc.updateItems([data.id])
    const bibResult = citeproc.makeBibliography()
    const cleanedUp = bibResult[1].join('')
        // remove html
        .replace(/<[^>]+>/g, '')
        // remove double spaces
        .replace(/ +/g, ' ')
        // replace &#38; with "&"
        .replace(/&#38;/g, '&')
        .trim()
    return cleanedUp
}

module.exports = {styleWith}
