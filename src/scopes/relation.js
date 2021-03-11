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

    record(attributes) {
        return this.#relation.record(this, attributes);
    }

    collection(items) {
        return this.#relation.collection(this, items);
    }

    hydrate(data) {
        if (Array.isArray(data)) {
            return this.collection(data);
        }

        return this.record(data);
    }
}

export default Relation;