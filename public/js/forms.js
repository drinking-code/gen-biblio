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

    function newOptions() {
        return [
            element('button', {
                innerText: 'Delete'
            }),
            element('button', {
                innerText: 'Don\'t output'
            }),
        ]
    }

    submitButton.addEventListener('click', async () => {
        const id = window.crypto.randomUUID()
        entryTable.addEntry({
            'Options': newOptions(),
            'DOI': doiInput.value.replace(/^(https?:\/\/(www\.)?doi\.org\/)?(.+)/, '$3'),
            [citationColumnName]: Table.defer,
        }, id)
        const data = await addEntry({
            id,
            doi: doiInput.value,
            style: styleElement.value,
            locale: localeElement.value,
        })
        entryTable.fill(id, citationColumnName, data.formattedCitation)
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
            'Options': newOptions(),
            'DOI': entry.doi,
            [citationColumnName]: citation,
        }, id)
        if (!formatted) {
            citation = await getFormattedEntry({id, locale: localeElement.value, style: styleElement.value})
            entryTable.fill(id, citationColumnName, citation)
        }
    })

    const entriesSections = element('div', {
        className: 'entries',
        children: [
            entryTable.element,
        ]
    }, document.body)
}
