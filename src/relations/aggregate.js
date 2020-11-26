class Aggregate {
    #items = {};

    get keys() {
        return Object.keys(this.#items);
    }

    has(name) {
        return typeof this.#items[name] !== 'undefined';
    }

    add(relation) {
        this.#items[relation.name] = relation;
    
        return this;
    }
    
    register(name, callback) {
        this.#items[name] = callback;
    
        return this;
    }
    
    get(name) {
        return this.has(name) ? this.resolve(name) : null;
    }
    
    resolve(name) {
        let item = this.#items[name];

        if (typeof item === 'function') {
            item = item();
            this.add(name, item);
        }

        return item;
    }
}

export default Aggregate;