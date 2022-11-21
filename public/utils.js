function element(tag, attributes, appendTo) {
    const el = document?.createElement(tag)

    for (const key in attributes) {
        if (!attributes.hasOwnProperty(key)) continue

        if (key === 'innerText')
            el.innerText = attributes[key]
        else if (key === 'innerHTML')
            el.innerHTML = attributes[key]
        else if (key === 'children') {
            if (Array.isArray(attributes[key])
                || attributes[key] instanceof NodeList
                || attributes[key] instanceof HTMLCollection) {
                attributes[key].forEach(child => el.appendChild(child))
            } else if (
                attributes[key] instanceof Node
                || attributes[key] instanceof Element
            ) {
                el.appendChild(attributes[key])
            }
        } else if (key === 'className') {
            el.classList.add(...attributes[key].split(' '))
        } else {
            el.setAttribute(key, attributes[key])
        }
    }

    if (appendTo)
        appendTo.appendChild(el)
    return el
}

function makeTabs(data, attributes) {
    Array.from(Object.values(data)).forEach((el, i) => {
        if (i === 0) return
        el.style.display = 'none'
    })
    const tabElements = Array.from(Object.entries(data))
        .map(([key], i) => {
            const radio = element('input', {type: 'radio'})
            if (i === 0)
                radio.checked = true
            radio.addEventListener('input', () => select(key))
            return element('label', {
                className: 'tab',
                children: [radio, element('span', {innerText: key})],
            })
        })

    function select(keyToSelect) {
        Array.from(Object.entries(data)).forEach(([key, element], i) => {
            if (keyToSelect === key) {
                tabElements[i].querySelector('input').checked = true
                element.style.display = ''
            } else {
                tabElements[i].querySelector('input').checked = false
                element.style.display = 'none'
            }
        })
    }

    return element('div', {
        ...attributes,
        children: [
            element('div', {children: tabElements}),
            ...Array.from(Object.values(data))
        ]
    })
}

class Table {
    static defer = Symbol('table.defer')

    constructor(columns) {
        this.columns = columns
        this.entries = []
        this.element = element('table', {
            children: element('thead', {
                children: element('tr', {
                    children: this.columns.map(columnName => element('th', {innerText: columnName}))
                })
            })
        })
    }

    addEntry(entries) {
        const missingColumns = new Set([...this.columns])
        Array.from(Object.keys(entries)).forEach(key => {
            if (!missingColumns.has(key)) throw new Error(`Column ${key} does not exist.`)
            missingColumns.delete(key)
        })
        element('tr', {
            children: Array.from(Object.entries(entries))
                .sort(([keyA], [keyB]) =>
                    this.columns.indexOf(keyA) - this.columns.indexOf(keyB)
                )
                .map(([key, value]) => element('td', {innerText: value.toString()}))
        }, this.element)
    }
}

function clearBody() {
    document.body.innerHTML = ''
}

function pressButtonOnEnter(input, button) {
    input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return
        button.click()
    })
}
