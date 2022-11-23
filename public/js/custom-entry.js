function makeCustomEntryInputs(makeOption) {
    const addButton = element('button', {innerText: 'Add author'})

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
                element('input', {placeholder: 'Dropping particle (van)'}),
                element('input', {placeholder: 'Surname (Beethoven)'}),
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
                element.querySelector(`.separate-name [placeholder="Dropping particle (van)"]`).value = name.particle ?? ''
                element.querySelector(`.separate-name [placeholder="Surname (Beethoven)"]`).value = name.surname ?? ''
            })
            setTimeout(() => tabsElement.remove())
            console.log(parsedNames)
        })

        return makeTabs({
            'Parse name': parsingNameRow,
            'Literal name (Companies)': literalNameRow,
            'Name (Separate inputs)': nameRow,
        }, {className: ['row-direction', 'full-border', 'center-inner', 'author'].join(' ')})
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
    ]
}
