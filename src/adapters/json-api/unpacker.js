class Unpacker {
    #model;

    #payload;

    #relationMap = {};

    #relationAliases = {};

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

        this.buildAliasMap();
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
            let alias = this.#relationAliases[type];

            if (Array.isArray(relationships[type].data)) {
                relations[alias] = [];

                relationships[type].data.forEach(relation => {
                    let record = this.mapRelation(type, relation);

                    if (record) {
                        relations[alias].push(record);
                    }
                });
            } else {
                let record = this.mapRelation(type, relationships[type].data);

                if (record) {
                    relations[alias] = record;
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

    buildAliasMap() {
        this.#model.relations.keys.forEach(key => {
            let relation = this.#model.relations.get(key);

            this.#relationAliases[relation.type || key] = key;
        });
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