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
    clearBody()
    const submitButton = element('button', {innerText: 'Add new entry'})
    const fileNameInput = element('input', {placeholder: 'DOI'})
    pressButtonOnEnter(fileNameInput, submitButton)
    const inputTypes = {
        'DOI': element('div', {
            children: [fileNameInput, submitButton]
        }),
        'Custom (Book, Article without DOI, etc.)': element('div', {})
    }

    const newThingSection = makeTabs(inputTypes, {className: 'input-section'})
    document.body.append(newThingSection)

    const defaultLocale = 'en-GB'
    const defaultStyle = 'apa'

    function makeOption(label, options, defaultOption) {
        return element('label', {
            children: [
                element('span', {innerText: label}),
                element('select', {
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
            ]
        })
    }

    const optionsSection = element('div', {
        className: 'input-section',
        children: [
            makeOption('Locale', locales, defaultLocale),
            makeOption('Style', styles, defaultStyle),
        ]
    }, document.body)

    const entryTable = new Table(['Entry Text', 'DOI', 'Options'])

    const entriesSections = element('div', {
        className: 'entries',
        children: [
            entryTable.element,
        ]
    }, document.body)
}
