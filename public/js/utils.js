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
                console.log(attributes[key])
                attributes[key].forEach(child => el.appendChild(child))
            } else if (
                attributes[key] instanceof Node
                || attributes[key] instanceof Element
            ) {
                el.appendChild(attributes[key])
            }
        } else if (key === 'className') {
            if (attributes[key] === '') continue
            el.classList.add(...attributes[key].split(' '))
        } else {
            el.setAttribute(key, attributes[key])
        }
    }

    if (appendTo)
        appendTo.appendChild(el)
    return el
}

function makeTabs(data, attributes, appendElements = []) {
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
            ...Array.from(Object.values(data)),
            ...appendElements,
        ]
    })
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
