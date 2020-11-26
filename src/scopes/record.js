import RelationScope from './relation';

class Record {
    #model;

    #key;

    constructor(model) {
        this.#model = model;
    }

    get key() {
        return this.getKey();
    }

    getKey() {
        return this.#key;
    }

    set key(key) {
        this.setKey(key);
    }

    setKey(key) {
        this.#key = key;

        return this;
    }

    resolve(name) {
        return new RelationScope(
            this.#model.relations.get(name),
            this
        );
    }
}

export default Record;