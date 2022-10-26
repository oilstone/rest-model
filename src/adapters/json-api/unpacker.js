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

    record(record) {
        const meta = record.meta || {};
        let attributes = Object.assign({}, record.attributes);

        attributes[this.#model.primaryKey] = record[this.#model.primaryKey];

        if ('relationships' in record) {
            attributes = Object.assign({}, attributes, this.relations(record.relationships));
        }

        return {
            meta,
            attributes
        };
    }

    relations(relationships) {
        let relations = {};

        for (let type in relationships) {
            if (relationships[type].data === null) {
                relations[type] = null;
                continue;
            }

            if (Array.isArray(relationships[type].data)) {
                let collectionPath;

                if (this.#model.relations.has(type)) {
                    relations[type] = {
                        meta: relationships[type].meta || {},
                        items: []
                    };

                    collectionPath = relations[type].items;
                } else {
                    // The relation has been included in the query but not defined on the model
                    relations[type] = [];
                    collectionPath = relations[type];
                }

                relationships[type].data.forEach(relation => {
                    let record = this.mapRelation(relation.type, relation);

                    if (record) {
                        collectionPath.push(record);
                    }
                });

                continue;
            }

            let record = this.mapRelation(relationships[type].data.type, relationships[type].data);

            if (record) {
                relations[type] = record;
            }
        }

        return relations;
    }

    mapRelation(type, relation) {
        let record = null;

        if (relation) {
            let key = `${type}:${relation.id}`;

            if (key in this.#relationMap) {
                record = this.record(this.#relationMap[key]);
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
