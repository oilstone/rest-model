class AccessToken {
    #type;

    #value;

    #refreshCallback;

    #refreshPromise;

    constructor(type, value) {
        this.#type = type;
        this.#value = value;
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

    get value() {
        return this.getValue();
    }

    getValue() {
        return this.#value;
    }

    set value(value) {
        return this.setValue(value);
    }

    setValue(value) {
        this.#value = value;

        return this;
    }

    onRefresh(callback) {
        this.#refreshCallback = callback;

        return this;
    }

    refresh() {
        if (this.#refreshPromise) {
            return this.#refreshPromise;
        }

        this.#refreshPromise = this.#refreshCallback(this);

        return this.#refreshPromise.then(() => {
            this.#refreshPromise = null;

            return true;
        });
    }

    toString() {
        return `${this.#type} ${this.#value}`;
    }
}

export default AccessToken;
