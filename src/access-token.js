class AccessToken {
    #type = 'Bearer';

    #value;

    #refreshCallback;

    #refreshPromise;

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

    set Value(value) {
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