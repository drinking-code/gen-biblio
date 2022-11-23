const trim = str => str.trim()
const isForenameShorthand = str => /^([A-Z]\.?\s?)+$/.test(str)

function parseNames(names) {
    /* types of name list:
     *1 [a], [b] & [c]
     *2 [a], [b], [c]
     *3 [a] [b] [c]
     *4 [a]\n[b]\n[c]
    */
    /* types of names format:
     *1 Albert Ben Cook
     *2 Albert B. Cook
     *3 Albert B Cook
     *4 A. B. Cook
     *5 A B Cook
     *6 Cook, A. B.
     *7 Cook, A B
     *8 Cook
    */
    let splitNames = names.split('&').map(trim)
    const lastMostName = splitNames[1]
    if (!!lastMostName) {
        // must be type 1
        splitNames = splitNames[0].split(',').map(trim).concat(lastMostName.split(',').map(trim))
        splitNames = recombineSeparatedNames(splitNames)
    } else {
        // must be type 2 or 3
        splitNames = splitNames[0].split(',').map(trim)
        if (splitNames.length > 1) {
            // had commas
            if (isForenameShorthand(splitNames[splitNames.length - 1])) {
                // name shorthands are shifted.
                // shift shorthands back
                splitNames = splitNames.map(str => {
                    const surnameMatch = str.match(/\S(?=[^\s.]).+/)
                    const surname = surnameMatch && surnameMatch[0]
                    str = str.replace(surname ?? '', '')
                    return [str, surname].filter(v => v).map(trim)
                }).flat()
            }
        }
        splitNames = recombineSeparatedNames(splitNames)
    }

    function recombineSeparatedNames(splitNames) {
        // check if names were separated by comma
        if (splitNames.some(isForenameShorthand)) {
            for (let i = 0; i < splitNames.length; i += 2) {
                splitNames[i] = [splitNames[i], splitNames[i + 1]].join(', ')
                splitNames[i + 1] = false
            }
            splitNames = splitNames.filter(v => v)
        }
        return splitNames
    }

    // check if names might be separated by newLine
    if (splitNames.length === 1) {
        // confirm newLine separator
        splitNames = splitNames[0].split("\n")
    }

    return splitNames.map(parseName)
}

function parseName(fullName) {
    /* types of names format:
     *1 Albert Ben Cook
     *2 Albert B. Cook
     *3 Albert B Cook
     *4 A. B. Cook
     *5 A B Cook
     *6 Cook, A. B.
     *7 Cook, A B
     *8 Cook
    */
    let surname, forename, particle
    if (/,/.test(fullName)) {
        [surname, forename] = fullName.split(',').map(trim)
    } else {
        let splitName = fullName.split(' ').map(str => str.replace(/,$/, ''))
        const areShorthands = splitName.map(isForenameShorthand)
        // forenames at end
        if (areShorthands[areShorthands.length - 1]) {
            // todo: "von den", "von der"
            if (surnameParticles.includes(splitName[0])) {
                particle = splitName.shift()
            }
            surname = splitName.shift()
            surname = [particle, surname].filter(v => v).join(' ')
            forename = [...splitName].join(' ')
        } else { // forenames (probably) at beginning
            surname = splitName.pop()
            if (surnameParticles.includes(splitName[splitName.length - 1])) {
                particle = splitName.pop()
            }
            surname = [particle, surname].filter(v => v).join(' ')
            forename = [...splitName].join(' ')
        }
    }
    return {forename, surname}
}
