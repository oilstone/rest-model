class Unpacker {
    #model;

    #payload;

    #relationMap = {};

    constructor(model, payload) {
        this.#model = model;
        this.#payload = payload;
    }

    status() {
        return this.#payload.status;
    }

    error() {
        return this.#payload.data.errors;
    }

    meta() {
        return this.#payload.data.meta;
    }

    data() {
        this.buildRelationMap();

        if (!Array.isArray(this.#payload.data.data)) {
            return this.record(this.#model, this.#payload.data.data);
        }

        return this.collection(this.#model, this.#payload.data);
    }

    collection(model, data) {
        const collection = {
            meta: data.meta || {},
            items: []
        };

        data.data.forEach(item => {
            collection.items.push(
                this.record(model, item)
            );
        });

        return collection;
    }

    record(model, data) {
        let relations = {};
        let attributes = Object.assign({}, data.attributes);

        attributes[model.primaryKey] = data[model.primaryKey];

        if ('relationships' in data) {
            relations = this.relations(model, data.relationships);
        }

        return {
            meta: data.meta || {},
            attributes,
            relations,
        };
    }

    relations(model, data) {
        const relations = {};

        const relationDefinitions = model.getRelations();
        relationDefinitions.resolveAll();

        for (let key in data) {
            const relationship = data[key];

            // If this is a collection
            if (Array.isArray(relationship.data)) {
                if (relationship.data.length) {
                    const relationDefinition = relationDefinitions.getByType(relationship.data[0].type);

                    if (relationDefinition) {
                        const relationKey = relationDefinition.getKey();

                        relations[relationKey] = {
                            meta: relationship.meta || {},
                            items: []
                        };

                        relationship.data.forEach(item => {
                            const record = this.makeRelation(relationDefinition.getForeignModel(), item);

                            if (record) {
                                relations[relationKey].items.push(record);
                            }
                        });
                    }
                }
            } else {
                if (relationship.date) {
                    const relationDefinition = relationDefinitions.getByType(relationship.data.type);

                    if (relationDefinition) {
                        const record = this.makeRelation(relationDefinition.getForeignModel(), relationship.data);

                        if (record) {
                            relations[relationDefinition.getKey()] = record;
                        }
                    }
                }
            }
        }

        return relations;
    }

    makeRelation(model, data) {
        let record = null;

        if (data) {
            const mapKey = `${model.type}:${data.id}`;

            if (mapKey in this.#relationMap) {
                record = this.record(model, this.#relationMap[mapKey]);
            }
        }

        return record;
    }

    buildRelationMap() {
        if (typeof this.#payload.data.included !== 'undefined') {
            this.#payload.data.included.forEach(included => {
                this.#relationMap[`${included.type}:${included.id}`] = included;
            });
        }

        return this;
    }
}

export default Unpacker;
