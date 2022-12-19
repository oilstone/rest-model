import { Dispatcher } from '@oilstone/events';
import { Blender } from '@oilstone/blender';
import Aggregate from './relations/aggregate';
import Factory from './factory';
import RecordScope from './scopes/record';

class Model {
    #http;

    #type;

    #baseUrl;

    #events = new Dispatcher();

    #relations = new Aggregate();

    #mixins = {
        query: {},
        record: {}
    };

    #primaryKey = 'id';

    constructor(http, type, baseUrl = null) {
        this.#http = http;
        this.#type = type;
        this.#baseUrl = baseUrl;
    }

    get http() {
        return this.getHttp();
    }

    getHttp() {
        return this.#http;
    }

    get type() {
        return this.getType();
    }

    getType() {
        return this.#type;
    }

    set type(type) {
        return this.setType(type);
    }

    setType(type) {
        this.#type = type;

        return this;
    }

    get baseUrl() {
        return this.getBaseUrl();
    }

    getBaseUrl() {
        return this.#baseUrl;
    }

    set baseUrl(url) {
        return this.setBaseUrl(url);
    }

    setBaseUrl(url) {
        this.#baseUrl = url;

        return this;
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

    set primaryKey(value) {
        this.setPrimaryKey(value);
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

    hydrateOne(data) {
        this.#events.fire('hydratingOne', data.attributes);

        // noinspection JSUnresolvedFunction
        let record = this.newRecord().$fill(data.attributes).$setMeta(data.meta);
        let scope = this.scope(record[this.getPrimaryKey()]);

        for (let key in data.relations) {
            record.$setRelation(
                key,
                scope.resolve(key).hydrate(data.relations[key])
            );
        }

        this.#events.fire('hydratedOne', record);

        return record.$mix(this.#mixins.record);
    }

    record(attributes) {
        this.#events.fire('making', attributes);

        // noinspection JSUnresolvedFunction
        let record = this.newRecord().$fill(attributes);

        this.#events.fire('made', record);

        return record.$mix(this.#mixins.record);
    }

    nest(name, callback = null) {
        this.#relations.register(name, () => {
            let relation = Factory.nested(this);

            this.#bootstrapRelation(name, relation, callback);

            return relation;
        });

        return this;
    }

    #bootstrapRelation(name, relation, callback) {
        if (callback) {
            callback(relation);
        }

        relation.setKey(name);

        if (!relation.binding) {
            relation.setBinding(name);
        }
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
