function makeNoLoadedFileForm() {
    clearBody()
    const submitButton = element('button', {innerText: 'Create new file'})
    const fileNameInput = element('input')
    pressButtonOnEnter(fileNameInput, submitButton)
    element('div', {
        children: [
            element('div', {
                className: 'suffix-json',
                children: fileNameInput,
            }),
            submitButton
        ]
    }, document.body)
    submitButton.addEventListener('click', async () => {
        const data = await createFile(fileNameInput.value)
        makeFileLoadedForm(data)
    })
}

function makeFileLoadedForm(data) {
    const citationColumnName = 'Formatted Citation'
    const noDOICharacter = '—'
    clearBody()
    const doiSubmitButton = element('button', {innerText: 'Add new entry'})
    const customSubmitButton = doiSubmitButton.cloneNode(true)
    const doiInput = element('input', {placeholder: 'DOI'})
    pressButtonOnEnter(doiInput, doiSubmitButton)
    const {clear: clearCustomEntryData, collectData: collectCustomEntryData, elements: customEntryElements} = makeCustomEntryInputs(makeOption)
    const inputTypes = {
        'DOI': element('div', {
            children: [doiInput, doiSubmitButton]
        }),
        'Custom (Book, Article without DOI, etc.)': element('div', {
            children: [
                ...customEntryElements,
                customSubmitButton
            ]
        }),
    }

    function newOptions(id, options) {
        const {hidden} = {
            hidden: false,
            ...options
        }

        const deleteButton = element('button', {
            innerText: 'Delete'
        })
        deleteButton.addEventListener('click', async () => {
            const formattedRaw = entryTable.entries[id][citationColumnName]
            const formatted = (typeof formattedRaw === 'string' ? formattedRaw : formattedRaw.innerText).substring(0, 20) + '...'
            if (!confirm(`Are you sure you want to remove? (${formatted}; ${entryTable.entries[id]['DOI']})`)) return
            hideButton.style.pointerEvents = 'none'
            entryTable.markEntry(id, 'hidden')
            await removeEntry(id)
            entryTable.removeEntry(id)
        })

        const hideButtonStates = ['Don\'t output', 'Do output']
        const hideButton = element('button', {
            innerText: hideButtonStates[Number(hidden)]
        })
        hideButton.addEventListener('click', async () => {
            hideButton.style.pointerEvents = 'none'
            const isNowHidden = !hideButtonStates.indexOf(hideButton.innerText)
            entryTable.markEntry(id, isNowHidden ? 'hidden' : '')
            await updateEntry({id, hidden: isNowHidden})
            hideButton.innerText = hideButtonStates[Number(isNowHidden)]
            hideButton.style.pointerEvents = ''
        })
        return [
            deleteButton,
            hideButton,
        ]
    }

    doiSubmitButton.addEventListener('click', async () => {
        const id = window.crypto.randomUUID()
        const pureDOI = doiInput.value.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, '$3')
        if (entryTable.hasInColumn('DOI', pureDOI)) {
            doiInput.value = ''
            return alert('This DOI already exists')
        }
        entryTable.addEntry({
            'Options': newOptions(id),
            'DOI': pureDOI,
            [citationColumnName]: Table.defer,
        }, id)
        const entryData = await addEntry({
            id,
            doi: doiInput.value,
            style: styleElement.value,
            locale: localeElement.value,
        })
        entryTable.fill(id, citationColumnName, entryData.formattedCitation)
        data.entries[id] = {
            type: 'doi',
            doi: doiInput.value
        }
        data.rendered.push({
            id,
            style: styleElement.value,
            locale: localeElement.value,
            formattedCitation: entryData.formattedCitation,
        })
        doiInput.value = ''
    })

    customSubmitButton.addEventListener('click', async () => {
        const id = window.crypto.randomUUID()
        entryTable.addEntry({
            'Options': newOptions(id),
            'DOI': noDOICharacter,
            [citationColumnName]: Table.defer,
        }, id)
        const collected = collectCustomEntryData()
        const entryData = await addEntry({
            id,
            ...collected,
            style: styleElement.value,
            locale: localeElement.value,
        })
        entryTable.fill(id, citationColumnName, entryData.formattedCitation)
        data.entries[id] = collected
        data.rendered.push({
            id,
            style: styleElement.value,
            locale: localeElement.value,
            formattedCitation: entryData.formattedCitation,
        })
        clearCustomEntryData()
    })

    const newThingSection = makeTabs(inputTypes, {className: 'input-section'})
    document.body.append(newThingSection)

    const defaultLocale = data.settings.locale
    const defaultStyle = data.settings.style

    function makeOption(label, options, defaultOption, changeEventListener) {
        const selectElement = element('select', {
            children: options.map(option => {
                const optionElement = element('option', {
                    innerText: option,
                    value: option,
                })
                if (defaultOption === option)
                    optionElement.selected = true
                return optionElement
            })
        })
        if (changeEventListener)
            selectElement.addEventListener('change', changeEventListener)

        return element('label', {
            children: [
                element('span', {innerText: label}),
                selectElement
            ]
        })
    }

    const localeLabel = makeOption('Locale', locales, defaultLocale, e => {
        const localeInputElement = e.target
        sendSetting('locale', localeInputElement.value)
        // grey out formatted
    })
    const styleLabel = makeOption('Style', styles, defaultStyle, e => {
        const styleInputElement = e.target
        sendSetting('style', styleInputElement.value)
        // grey out formatted
    })
    const localeElement = localeLabel.querySelector('select')
    const styleElement = styleLabel.querySelector('select')
    const optionsSection = element('div', {
        className: 'input-section',
        children: [
            localeLabel,
            styleLabel,
        ]
    }, document.body)

    const outputButton = element('button', {innerText: 'Generate Bibliography'})
    outputButton.addEventListener('click', () => {
        const sortedFormattedCitations = entryTable.sortedIds.map(id => entryTable.entries[id][citationColumnName].trim())
        showBibliography(sortedFormattedCitations)
    })
    const outputButtonSection = element('div', {
        className: 'input-section generate-section',
        children: outputButton
    }, document.body)

    const entryTable = new Table([citationColumnName, 'DOI', 'Options'], [citationColumnName, 'DOI'])
    Array.from(Object.entries(data.entries)).forEach(async ([id, entry]) => {
        const formatted = data.rendered.find(entry => {
            return !(entry.id !== id || entry.locale !== localeElement.value || entry.style !== styleElement.value)
        })
        let citation = Table.defer
        if (formatted)
            citation = formatted.formattedCitation
        entryTable.addEntry({
            'Options': newOptions(id, {hidden: entry.hidden}),
            'DOI': entry.doi ?? noDOICharacter,
            [citationColumnName]: citation,
        }, id)
        if (entry.hidden)
            entryTable.markEntry(id, 'hidden')
        if (!formatted) {
            citation = await getFormattedEntry({id, locale: localeElement.value, style: styleElement.value})
            if (citation?.formattedCitation === false)
                entryTable.fill(id, citationColumnName, element('span', {
                    className: 'error',
                    innerText: 'Error: Something went wrong on the api.crossref.org server',
                }))
            else
                entryTable.fill(id, citationColumnName, citation.formattedCitation)
        }
    })

    const entriesSections = element('div', {
        className: 'entries',
        children: [
            entryTable.element,
        ]
    }, document.body)
}
