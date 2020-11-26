import Dispatcher from '@oilstone/events';
import Blender from '@oilstone/blender';
import Registry from './registry';
import Aggregate from './relations/aggregate';
import Factory from './factory';
import RecordScope from './scopes/record';

class Model {
    #http;

    #type;

    #events = new Dispatcher();

    #relations = new Aggregate();

    #mixins = {
        query: {},
        record: {}
    };

    #primaryKey = 'id';

    constructor(http, type) {
        this.#http = http;
        this.#type = type;
    }

    get type() {
        return this.getType();
    }

    getType() {
        return this.#type;
    }

    get http() {
        return this.getHttp();
    }

    getHttp() {
        return this.#http;
    }

    get events() {
        return this.getEvents();
    }

    getEvents() {
        return this.#events;
    }

    get relations() {
        return this.getRelations();
    }

    getRelations() {
        return this.#relations;
    }

    get primaryKey() {
        return this.getPrimaryKey();
    }

    getPrimaryKey() {
        return this.#primaryKey;
    }

    set primaryKey(key) {
        return this.setPrimaryKey(key);
    }

    setPrimaryKey(key) {
        this.#primaryKey = key;

        return this;
    }

    mix(mixins) {
        if ('model' in mixins) {
            Blender.on(this).mix(mixins.model);
            delete mixins.model;
        }

        for (let prop in mixins) {
            if (prop in this.#mixins) {
                this.#mixins[prop] = Blender.mix(this.#mixins[prop], mixins[prop]);
            }
        }

        return this;
    }

    observe(observer) {
        this.#events.listen(observer);
    }

    record(attributes) {
        this.#events.fire('making', attributes);

        // noinspection JSUnresolvedFunction
        let record = this.newRecord().$fill(attributes);

        this.#relations.keys.forEach(key => {
            if (key in record) {
                record[key] = this.#relations.get(key).hydrate(attributes[key]);
            }
        });

        this.#events.fire('made', record);

        return record.$mix(this.#mixins.record);
    }

    nest(name, callback = null) {
        this.#relations.register(name, () => {
            let relation = Factory.nested(this);

            if (callback) {
                callback(relation);
            }

            relation.setForeignModel(
                Registry.get(relation.type || name)
            );

            return relation;
        });

        return this;
    }

    query() {
        // noinspection JSUnresolvedFunction
        let builder = this.queryBuilder();

        return builder.mix(this.#mixins.query);
    }

    scope(key) {
        return new RecordScope(this).setKey(key);
    }
}

export default Model;