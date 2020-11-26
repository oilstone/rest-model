class Repacker {
    #model;

    #record;

    constructor(model, record) {
        this.#model = model;
        this.#record = record;
    }

    data() {
        let id = this.extractId();
        let attributes = this.extractAttributes();
        let data = {
            type: this.#model.type
        };

        if (id) {
            data.id = id;
        }

        if (attributes) {
            data.attributes = attributes;
        }

        return {
            data
        };
    }
    extractId() {
        let attributes = this.#record.$attributes;

        return typeof attributes[this.#model.primaryKey] !== 'undefined' && attributes[this.#model.primaryKey] ? attributes[this.#model.primaryKey] : null;
    }

    extractAttributes() {
        let attributes = JSON.parse(
            JSON.stringify(this.#record.$attributes)
        );

        if (typeof attributes[this.#model.primaryKey] !== 'undefined') {
            delete attributes[this.#model.primaryKey];
        }

        return attributes;
    }
}

export default Repacker;
