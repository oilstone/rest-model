import Restmodel from './rest-model';

class Path {
    #model;

    #key;

    #parent;

    constructor(model) {
        this.#model = model;
    }

    set key(key) {
        this.setKey(key);
    }

    setKey(key) {
        this.#key = key;

        return this;
    }

    prepend(path) {
        this.#parent = path;

        return this;
    }

    resolve() {
        let pieces = [];

        if (this.#parent) {
            pieces.push(this.#parent.resolve());
        } else {
            pieces.push(Restmodel.baseUrl);
        }

        pieces.push(this.#model.type);

        if (this.#key) {
            pieces.push(this.#key);
        }

        return pieces.filter(item => item).join('/');
    }
}

export default Path;