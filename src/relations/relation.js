class Relation {
    #localModel;

    #foreignModel;

    #type;

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
        return this.#foreignModel;
    }

    set foreignModel(model) {
        return this.setForeignModel(model);
    }

    setForeignModel(model) {
        this.#foreignModel = model;

        return this;
    }

    get type() {
        return this.getType();
    }

    getType() {
        return this.#type;
    }

    bind(type) {
        this.#type = type;

        return this;
    }

    hydrate(data) {
        if (Array.isArray(data)) {
            return this.#foreignModel.collection(data);
        }

        return this.#foreignModel.record(data);
    }
}

export default Relation;