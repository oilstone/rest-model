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
            return this.record(this.#payload.data.data);
        }

        return this.collection(this.#payload.data);
    }

    collection(data) {
        const collection = {
            meta: data.meta || {},
            items: []
        };

        data.data.forEach(item => {
            collection.items.push(this.record(item));
        });

        return collection;
    }

    attributes(data) {
        let attributes = Object.assign({}, data.attributes);

        attributes[this.#model.primaryKey] = data[this.#model.primaryKey];

        if ('relationships' in data) {
            attributes = Object.assign({}, attributes, this.relations(data.relationships));
        }

        return attributes;
    }

    record(data) {
        return {
            meta: data.meta || {},
            attributes: this.attributes(data)
        };
    }

    relation(key, data) {
        if (this.#model.relations.has(key)) {
            return this.record(data);
        }

        return this.attributes(data);
    }

    relations(relationships) {
        let relations = {};

        for (let key in relationships) {
            if (relationships[key].data === null) {
                relations[key] = null;
                continue;
            }

            if (Array.isArray(relationships[key].data)) {
                let collectionPath;

                if (this.#model.relations.has(key)) {
                    relations[key] = {
                        meta: relationships[key].meta || {},
                        items: []
                    };

                    collectionPath = relations[key].items;
                } else {
                    // The relation has been included in the query but not defined on the model
                    relations[key] = [];
                    collectionPath = relations[key];
                }

                relationships[key].data.forEach(relation => {
                    let record = this.mapRelation(key, relation.type, relation);

                    if (record) {
                        collectionPath.push(record);
                    }
                });

                continue;
            }

            let record = this.mapRelation(key, relationships[key].data.type, relationships[key].data);

            if (record) {
                relations[key] = record;
            }
        }

        return relations;
    }

    mapRelation(relationKey, type, relation) {
        let record = null;

        if (relation) {
            let mapKey = `${type}:${relation.id}`;

            if (mapKey in this.#relationMap) {
                record = this.relation(relationKey, this.#relationMap[mapKey]);
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
