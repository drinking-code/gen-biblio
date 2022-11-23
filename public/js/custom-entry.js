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
            console.log(parsedNames)
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

    return [
        element('div', {
            children: makeOption('Type', entryTypes, 'article-newspaper')
        }),
        element('div', {
            children: [
                element('input', {placeholder: 'Title'}),
                element('label', {
                    children: [
                        element('span', {innerText: 'Issued on'}),
                        element('input', {type: 'date'})
                    ]
                }),
                element('label', {
                    children: [
                        element('span', {innerText: 'Accessed on'}),
                        element('input', {type: 'date'})
                    ]
                }),
            ]
        }),
        element('div', {
            children: [
                element('span', {
                    children: element('b', {
                        innerText: 'Authors',
                    })
                }),
                newAuthorEntry(),
                addButton
            ]
        }),
        element('div', {
            children: [
                element('input', {
                    placeholder: 'ISBN'
                }),
                element('span', {
                    innerText: ' / ',
                }),
                element('input', {
                    placeholder: 'ISSN'
                }),
            ]
        }),
        element('div', {
            children: [
                element('input', {
                    placeholder: 'Publisher'
                }),
                element('input', {
                    placeholder: 'Publisher place'
                }),
            ]
        }),
        element('div', {
            children: [
                element('input', {
                    placeholder: 'Issue'
                }),
                element('input', {
                    placeholder: 'Volume'
                }),
                element('span', {
                    innerText: ' – ',
                }),
                element('input', {
                    placeholder: 'Page ("2" or "2-3")'
                }),
            ]
        }),
        element('div', {
            children: [
                element('input', {
                    type: 'url',
                    placeholder: 'URL',
                }),
            ]
        }),
    ]
}
