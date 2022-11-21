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
    const fileNameInput = element('input', {placeholder: 'doi'})
    pressButtonOnEnter(fileNameInput, submitButton)
    const inputTypes = {
        'doi': element('div', {
            children: [fileNameInput, submitButton]
        }),
        'custom (book, article without doi, etc.)': element('div', {})
    }

    const newThingSection = tabs(inputTypes)
    document.body.append(newThingSection)

    const optionsSection = element('div', {
        children: []
    }, document.body)
}
