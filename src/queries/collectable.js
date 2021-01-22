import Query from './query';
import Expression from './builders/expression';
import RestModel from '../rest-model';
import Orders from './builders/orders';
import TypeConstraint from './builders/type-constraint';

class Collectable extends Query {
    #filters;

    #orders;

    #limits;

    #offsets;

    constructor(model, path) {
        super(model, path);

        this.#filters = new Expression(this.pipeline);
        this.#orders = new Orders(model, this.pipeline);
        this.#limits = new TypeConstraint(model, this.pipeline);
        this.#offsets = new TypeConstraint(model, this.pipeline);
    }

    get filters() {
        return this.getFilters();
    }

    getFilters() {
        return this.#filters;
    }

    get orders() {
        return this.getOrders();
    }

    getOrders() {
        return this.#orders;
    }

    get limits() {
        return this.getLimits();
    }

    getLimits() {
        return this.#limits;
    }

    get offsets() {
        return this.getOffsets();
    }

    getOffsets() {
        return this.#offsets;
    }

    where(...args) {
        this.#filters.where(...args);

        return this;
    }

    orWhere(...args) {
        this.#filters.orWhere(...args);

        return this;
    }

    sort(pipeline, direction = 'asc') {
        this.#orders.resolve(pipeline, direction);

        return this;
    }

    limit(...args) {
        this.#limits.resolve(...args);

        return this;
    }

    offset(...args) {
        this.#offsets.resolve(...args);

        return this;
    }

    find(id) {
        this.model.events.fire('fetchingOne', this);

        return this.model.http.get(this.path.setKey(id).resolve(), this.buildRequestConfig()).then(response => {
            let record = this.model.record(
                RestModel.adapter.unpack(this.model, response)
            );

            this.model.events.fire('fetchedOne', record);

            return record;
        });
    }

    get() {
        this.model.events.fire('fetchingMany', this);

        return this.model.http.get(this.path.resolve(), this.buildRequestConfig()).then(response => {
            let collection = this.model.collection(
                RestModel.adapter.unpack(this.model, response)
            );

            this.model.events.fire('fetchedMany', collection);

            return collection;
        });

    }

    first() {
        return this.get().then(result => {
            return result.length ? result[0] : null;
        });
    }
}

export default Collectable;