import Registry from "../registry";

class Relation {
    #localModel;

    #foreignModel;

    #binding;

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

    bind(binding) {
        this.#binding = binding;

        return this;
    }

    get binding() {
        return this.getBinding();
    }

    getBinding() {
        return this.#binding;
    }

    hydrate(data) {
        if (Array.isArray(data)) {
            return this.getForeignModel().collection(data);
        }

        return this.getForeignModel().record(data);
    }
}

export default Relation;