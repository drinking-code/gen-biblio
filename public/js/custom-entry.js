function makeCustomEntryInputs(makeOption) {
    const addButton = element('button', {innerText: 'Add author'})

    addButton.addEventListener('click', () => {
        const lastAuthorEntryElement = addButton.parentNode.querySelector('.author:last-of-type')
        lastAuthorEntryElement.insertAdjacentElement('beforebegin', newAuthorEntry())
    })

    const newAuthorEntry = () => {
        const literalNameRow = element('div', {
            children: [
                element('input', {placeholder: 'Name'}),
            ]
        })

        const parseInput = element('textarea', {placeholder: 'Full Name(s)'})
        const parseButton = element('button', {innerText: 'Parse'})
        const parsingNameRow = element('div', {
            children: [
                parseInput,
                parseButton,
            ]
        })
        const nameRow = element('div', {
            className: 'separate-name',
            children: [
                element('input', {placeholder: 'Forename (Ludwig)'}),
                element('input', {placeholder: 'Surname (van Beethoven)'}),
            ]
        })

        parseButton.addEventListener('click', () => {
            const parsedNames = parseNames(parseInput.value)
            let tabsElement = parseInput
            while (!tabsElement.classList.contains('author')) {
                tabsElement = tabsElement.parentNode
            }
            parsedNames.map(name => {
                const element = newAuthorEntry()
                tabsElement.insertAdjacentElement('beforebegin', element)
                Array.from(element.querySelectorAll('label'))
                    .find(label => label.innerText === 'Name (Separate inputs)')
                    .querySelector('input').click()
                element.querySelector(`.separate-name [placeholder="Forename (Ludwig)"]`).value = name.forename ?? ''
                element.querySelector(`.separate-name [placeholder="Surname (van Beethoven)"]`).value = name.surname ?? ''
            })
            setTimeout(() => tabsElement.remove())
        })

        const removeButton = element('button', {innerText: 'Remove'})

        removeButton.addEventListener('click', () => {
            authorElement.remove()
        })

        const authorElement = makeTabs(
            {
                'Parse name': parsingNameRow,
                'Literal name (Companies)': literalNameRow,
                'Name (Separate inputs)': nameRow,
            },
            {className: ['row-direction', 'full-border', 'center-inner', 'author'].join(' ')},
            [element('div', {
                className: 'set-left',
                children: [removeButton]
            })]
        )

        return authorElement
    }

    const authorsWrapper = element('div', {
        children: [
            element('span', {children: element('b', {innerText: 'Authors'})}),
            newAuthorEntry(),
            addButton
        ]
    })

    const typeLabel = makeOption('Type', entryTypes, 'article-newspaper')
    const typeInput = typeLabel.querySelector('select')
    const titleInput = element('input', {placeholder: 'Title'})
    const issuedInput = element('input', {type: 'date'})
    const accessedInput = element('input', {type: 'date'})
    const getAuthorsData = () => {
        const authorsRows = Array.from(authorsWrapper.querySelectorAll('.author'))
        const inputs = authorsRows.map(authorWrapper => {
            const children = Array.from(authorWrapper.children)
            children.shift()
            children.pop()
            return Array.from(
                children.find(child => child.style.display !== 'none').querySelectorAll('input')
            )
        })
        return inputs.map(inputs => {
            if (inputs.length === 0)
                return false
            if (inputs.length === 1) {
                return {literal: inputs[0].value}
            } else {
                return {
                    given: inputs[0].value,
                    family: inputs[1].value,
                }
            }
        }).filter(v => v)
    }
    const clearAuthorsData = () => {
        const authorTitle = authorsWrapper.querySelector('.author').previousElementSibling
        Array.from(authorsWrapper.querySelectorAll('.author')).forEach(el => el.remove())
        setTimeout(() => authorTitle.insertAdjacentElement('afterend', newAuthorEntry()))
    }
    const isbnInput = element('input', {placeholder: 'ISBN'})
    const issnInput = element('input', {placeholder: 'ISSN'})
    const publisherInput = element('input', {placeholder: 'Publisher'})
    const publisherPlaceInput = element('input', {placeholder: 'Publisher place'})
    const issueInput = element('input', {placeholder: 'Issue'})
    const volumeInput = element('input', {placeholder: 'Volume'})
    const pageInput = element('input', {placeholder: 'Page ("2" or "2-3")'})
    const urlInput = element('input', {
        type: 'url',
        placeholder: 'URL',
    })

    return {
        clear() {
            typeInput.value = ''
            titleInput.value = ''
            issuedInput.value = ''
            accessedInput.value = ''
            clearAuthorsData()
            isbnInput.value = ''
            issnInput.value = ''
            publisherInput.value = ''
            publisherPlaceInput.value = ''
            issueInput.value = ''
            volumeInput.value = ''
            pageInput.value = ''
            urlInput.value = ''
        },
        collectData() {
            const data = {
                type: typeInput.value,
                title: titleInput.value,
                issued: {
                    raw: issuedInput.value
                },
                accessed: {
                    raw: accessedInput.value
                },
                author: getAuthorsData(),
                isbn: isbnInput.value,
                issn: issnInput.value,
                publisher: publisherInput.value,
                publisherPlace: publisherPlaceInput.value,
                issue: issueInput.value,
                volume: volumeInput.value,
                page: pageInput.value,
                url: urlInput.value,
            }
            return Object.fromEntries(
                Array.from(Object.entries(data))
                    .map(([key, value]) => [key, value === '' || value.raw === '' ? undefined : value])
            )
        },
        elements: [
            element('div', {children: typeInput}),
            element('div', {
                children: [titleInput,
                    element('label', {
                        children: [element('span', {innerText: 'Issued on'}), issuedInput]
                    }),
                    element('label', {
                        children: [element('span', {innerText: 'Accessed on'}), accessedInput]
                    }),
                ]
            }),
            authorsWrapper,
            element('div', {
                children: [isbnInput, element('span', {innerText: ' / '}), issnInput]
            }),
            element('div', {children: [publisherInput, publisherPlaceInput]}),
            element('div', {
                children: [issueInput, volumeInput, element('span', {innerText: ' – '}), pageInput]
            }),
            element('div', {children: urlInput}),
        ]
    }
}
