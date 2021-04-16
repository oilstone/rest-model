import Path from '../path';
import Blender from '@oilstone/blender';

class Record {
    #model;

    #path;

    #attributes = {};

    #dirty = false;

    constructor(model) {
        this.#model = model;
        this.#path = new Path(model);

        return new Proxy(
            this,
            {
                get: (target, property) => {
                    if (Reflect.has(this, property)) {
                        return Reflect.get(this, property);
                    }

                    return this.$attributes[property];
                },

                set: (target, property, value) => {
                    if (this.$attributes[property] !== value) {
                        this.$attributes[property] = value;

                        this.#dirty = true;
                    }

                    return true;
                }
            }
        );
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
        return this.$getAttributes();
    }

    $getAttributes() {
        return this.#attributes;
    }

    $mix(mixins) {
        Blender.on(this).mix(mixins);

        return this;
    }

    $fill(attributes) {
        Object.assign(this, attributes || {});

        return this;
    }

    $resolve(relation) {
        return this.#model.scope(
            this.$attributes[this.#model.getPrimaryKey()]
        ).resolve(relation);
    }

    $isDirty() {
        return this.#dirty;
    }
}

export default Record;