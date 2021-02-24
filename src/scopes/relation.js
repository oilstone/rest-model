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

    record() {
        return this.#relation.record(this);
    }
}

export default Relation;