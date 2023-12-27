/* class ProductsApi {
    constructor() {
        this.elements = []
        this.id = 0
    }

    show(id) {
        const elem = this.elements.find(elem => elem.id == id)
        return elem || { error: `elemento no encontrado` }
    }

    showAll() {
        return [...this.elements]
    }

    save(elem) {
        const newElem = { ...elem, id: ++this.id }
        this.elements.push(newElem)
        return newElem
    }

    update(elem, id) {
        const newElem = { id: Number(id), ...elem }
        const index = this.elements.findIndex(p => p.id == id)
        if (index !== -1) {
            this.elements[index] = newElem
            return newElem
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    delete(id) {
        const index = this.elements.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elements.splice(index, 1)
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    deleteAll() {
        this.elements = []
    }
}

module.exports = ProductsApi
 */