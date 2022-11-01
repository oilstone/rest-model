class Aggregate {
    #items = {};

    get keys() {
        return Object.keys(this.#items);
    }

    has(name) {
        return typeof this.#items[name] !== 'undefined';
    }

    add(name, relation) {
        this.#items[name] = relation;

        return this;
    }

    register(name, callback) {
        this.#items[name] = callback;

        return this;
    }

    get(name) {
        return this.has(name) ? this.resolve(name) : null;
    }

    getByType(type) {
        for (let name in this.#items) {
            const relation = this.get(name);

            if (relation.getForeignModel().type === type) {
                return relation;
            }
        }

        return null;
    }

    resolve(name) {
        let item = this.#items[name];

        if (typeof item === 'function') {
            item = item();
            this.add(name, item);
        }

        return item;
    }

    resolveAll() {
        for (let name in this.#items) {
            this.resolve(name);
        }

        return this;
    }
}

export default Aggregate;
