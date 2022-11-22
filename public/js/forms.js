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
    clearBody()
    const submitButton = element('button', {innerText: 'Add new entry'})
    const doiInput = element('input', {placeholder: 'DOI'})
    pressButtonOnEnter(doiInput, submitButton)
    const inputTypes = {
        'DOI': element('div', {
            children: [doiInput, submitButton]
        }),
        'Custom (Book, Article without DOI, etc.)': element('div', {})
    }

    function newOptions(id, {hidden}) {
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
            element('button', {
                innerText: 'Delete'
            }),
            hideButton,
        ]
    }

    submitButton.addEventListener('click', async () => {
        const id = window.crypto.randomUUID()
        entryTable.addEntry({
            'Options': newOptions(id),
            'DOI': doiInput.value.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, '$3'),
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

    const entryTable = new Table([citationColumnName, 'DOI', 'Options'])
    Array.from(Object.entries(data.entries)).forEach(async ([id, entry]) => {
        const formatted = data.rendered.find(entry => {
            return !(entry.id !== id || entry.locale !== localeElement.value || entry.style !== styleElement.value)
        })
        let citation = Table.defer
        if (formatted)
            citation = formatted.formattedCitation
        entryTable.addEntry({
            'Options': newOptions(id, {hidden: entry.hidden}),
            'DOI': entry.doi,
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
