import Registry from "../registry";

class Relation {
    #localModel;

    #foreignModel;

    #key;

    #binding;

    #includeKey;

    constructor(localModel) {
        this.#localModel = localModel;
    }

    get localModel() {
        return this.getLocalModel();
    }

    getLocalModel() {
        return this.#localModel;
    }

    get foreignModel() {
        return this.getForeignModel();
    }

    getForeignModel() {
        if (!this.#foreignModel) {
            this.#foreignModel = Registry.get(this.#binding)
        }

        return this.#foreignModel;
    }

    set foreignModel(model) {
        return this.setForeignModel(model);
    }

    setForeignModel(model) {
        this.#foreignModel = model;

        return this;
    }

    setKey(name) {
        this.#key = name;

        return this;
    }

    set key(name) {
        this.setKey(name);
    }

    getKey() {
        return this.#key;
    }

    get key() {
        return this.getKey();
    }

    setIncludeKey(name) {
        this.#includeKey = name;

        return this;
    }

    set includeKey(name) {
        this.setIncludeKey(name);
    }

    getIncludeKey() {
        return this.#includeKey;
    }

    get includeKey() {
        return this.getIncludeKey();
    }

    setBinding(binding) {
        this.#binding = binding;

        return this;
    }

    get binding() {
        return this.getBinding();
    }

    getBinding() {
        return this.#binding;
    }
}

export default Relation;
