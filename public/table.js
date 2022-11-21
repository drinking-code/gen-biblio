class Table {
    static defer = Symbol('table.defer')

    constructor(columns) {
        this.columns = columns
        this.entries = {}
        this.entryElements = {}
        this.element = element('table', {
            children: element('thead', {
                children: element('tr', {
                    children: this.columns.map(columnName => element('th', {innerText: columnName}))
                })
            })
        })
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
            id = self.crypto.randomUUID()
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
                    } else {
                        return element('td', {innerText: value.toString()})
                    }
                })
        }, this.element)
        this.entries[id] = entries
        return id
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
        cellElement.innerText = value
        cellElement.classList.remove('loading')
    }
}
