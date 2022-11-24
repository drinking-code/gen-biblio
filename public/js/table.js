class Table {
    static defer = Symbol('table.defer')

    constructor(columns, sortable = []) {
        this.columns = columns
        this.entries = {}
        this.entryElements = {}
        this.element = element('table', {
            children: element('thead', {
                children: element('tr', {
                    children: this.columns.map(columnName => {
                        const header = element('th', {
                            className: [
                                sortable[0] === columnName && 'sorted',
                                sortable.includes(columnName) && 'sortable'
                            ].filter(v => v).join(' '),
                            innerText: columnName,
                        })
                        if (sortable.includes(columnName))
                            header.addEventListener('click', () => {
                                if (header.classList.contains('sorted')) {
                                    header.classList.toggle('reversed')
                                } else {
                                    Array.from(header.parentNode.children)
                                        .forEach(el => el.classList.remove('sorted', 'reversed'))
                                    header.classList.add('sorted')
                                }
                                this.sort(columnName, header.classList.contains('reversed'))
                            })
                        return header
                    })
                })
            })
        })
        this.sortedBy = sortable[0]
        this.sortedReverse = false
    }

    addEntry(entries, id) {
        const missingColumns = new Set([...this.columns])
        Array.from(Object.keys(entries)).forEach(key => {
            if (!missingColumns.has(key)) throw new Error(`Column ${key} does not exist.`)
            missingColumns.delete(key)
        })
        if (missingColumns.size > 0)
            throw new Error(`Missing column values: ${Array.from(missingColumns).join(', ')}.`)
        if (!id)
            id = window.crypto.randomUUID()
        this.entryElements[id] = element('tr', {
            children: Array.from(Object.entries(entries))
                .sort(([keyA], [keyB]) =>
                    this.columns.indexOf(keyA) - this.columns.indexOf(keyB)
                )
                .map(([key, value]) => {
                    if (value === Table.defer) {
                        return element('td', {
                            className: 'loading'
                        })
                    } else if (typeof value === 'string') {
                        return element('td', {innerText: value.toString()})
                    } else {
                        return element('td', {children: value})
                    }
                })
        }, this.element)
        this.entries[id] = entries

        this.sort(this.sortedBy, this.sortedReverse)
        return id
    }

    removeEntry(id) {
        this.entryElements[id].remove()
        delete this.entryElements[id]
        delete this.entries[id]
    }

    markEntry(id, mark) {
        this.entryElements[id].className = mark
    }

    fill(id, column, value) {
        if (!this.entries.hasOwnProperty(id))
            throw new Error(`Entry with id ${id} does not exist.`)

        if (this.columns.indexOf(column) === -1)
            throw new Error(`Column ${column} does not exist.`)

        if (this.entries[id][column] !== Table.defer)
            throw new Error(`Cell ${column} of entry ${id} is filled already.`)

        this.entries[id][column] = value
        const columnIndex = this.columns.indexOf(column)
        const cellElement = Array.from(this.entryElements[id].children)[columnIndex]
        if (typeof value === 'string') {
            cellElement.innerText = value
        } else {
            cellElement.innerHTML = ''
            cellElement.append(value)
        }
        cellElement.classList.remove('loading')

        if (column === this.sortedBy)
            this.sort(this.sortedBy, this.sortedReverse)
    }

    hasInColumn(column, value) {
        if (this.columns.indexOf(column) === -1)
            throw new Error(`Column ${column} does not exist.`)

        return Array.from(Object.values(this.entries)).find(entry => {
            return entry[column] === value
        })
    }

    sort(column, reverse = false) {
        this.sortedBy = column
        this.sortedReverse = reverse
        let sorted = Array.from(Object.entries(this.entries)).sort(([idA, entryA], [idB, entryB]) => {
            const aCol = (entryA[column] === Table.defer) ? '' : entryA[column]
            const bCol = (entryB[column] === Table.defer) ? '' : entryB[column]
            return aCol.localeCompare(bCol)
        })
        if (reverse)
            sorted = sorted.reverse()
        const sortedIds = sorted.map(([id, entry]) => id)
        Object.values(this.entryElements).forEach(el => el.remove())
        sortedIds.forEach(id => {
            this.element.append(this.entryElements[id])
        })
        this.sortedIds = sortedIds
    }
}
