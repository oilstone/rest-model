class Relation {
    #relation;

    #recordScope;

    constructor(relation, recordScope) {
        this.#relation = relation;
        this.#recordScope = recordScope;
    }

    get recordScope() {
        return this.getRecordScope();
    }

    getRecordScope() {
        return this.#recordScope;
    }

    query() {
        return this.#relation.query(this);
    }

    hydrateOne(data) {
        return this.#relation.hydrateOne(this, data);
    }

    record(attributes) {
        return this.#relation.record(this, attributes);
    }

    collection(items) {
        return this.#relation.collection(this, items);
    }

    hydrateMany(data) {
        return this.#relation.hydrateMany(this, data);
    }

    destroy(id) {
        return this.#relation.destroy(this, id);
    }

    make(data) {
        if (Array.isArray(data)) {
            return this.collection(data);
        }

        return this.record(data);
    }

    hydrate(data) {
        if (typeof data.items !== 'undefined') {
            return this.hydrateMany(data);
        }

        return this.hydrateOne(data);
    }
}

export default Relation;
