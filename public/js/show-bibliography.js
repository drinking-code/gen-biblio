function showBibliography(bibliographyText) {
    const closeButton = element('button', {innerText: 'Close'})
    const copyButton = element('button', {innerText: 'Copy all'})
    closeButton.addEventListener('click', () => bibOverlay.remove())
    copyButton.addEventListener('click', () => navigator.clipboard.writeText(bibliographyText.join("\n")))
    const bibOverlay = element('div', {
        className: 'overlay',
        children: element('div', {
            className: 'bibliography-wrapper',
            children: [
                closeButton,
                copyButton,
                ...bibliographyText.map(text =>
                    element('p', {
                        className: 'bibliography',
                        innerText: text
                    })
                )
            ]
        })
    }, document.body)
}
