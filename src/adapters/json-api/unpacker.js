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

    data() {
        let data = this.#payload.data.data;

        this.buildRelationMap();

        if (!Array.isArray(data)) {
            return this.record(data);
        }

        return this.collection(data);
    }

    collection(collection) {
        return collection.map(item => {
            return this.record(item);
        });
    }

    record(record) {
        let attributes = Object.assign({}, record.attributes);

        attributes[this.#model.primaryKey] = record[this.#model.primaryKey];

        if ('relationships' in record) {
            attributes = Object.assign({}, attributes, this.relations(record.relationships));
        }

        return attributes;
    }

    relations(relationships) {
        let relations = {};

        for (let type in relationships) {
            if (Array.isArray(relationships[type].data)) {
                relations[type] = [];

                relationships[type].data.forEach(relation => {
                    let record = this.mapRelation(type, relation);

                    if (record) {
                        relations[type].push(record);
                    }
                });
            } else {
                let record = this.mapRelation(type, relationships[type].data);

                if (record) {
                    relations[type] = record;
                }
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
