import Path from '../path';
import Blender from '@oilstone/blender';

class Record {
    #model;

    #path;

    constructor(model) {
        this.#model = model;
        this.#path = new Path(model);
    }

    get $model() {
        return this.$getModel();
    }

    $getModel() {
        return this.#model;
    }

    get $path() {
        return this.$getPath();
    }

    $getPath() {
        return this.#path;
    }

    get $attributes() {
        let attributes = {};
        let relations = this.#model.relations.keys;

        for(let prop in this) {
            if(typeof this[prop] !== 'function' && relations.indexOf(prop) === -1) {
                attributes[prop] = this[prop];
            }
        }

        return attributes;
    }

    $mix(mixins) {
        Blender.on(this).mix(mixins);

        return this;
    }

    $fill(attributes) {
        Object.assign(this, attributes);

        return this;
    }
}

export default Record;