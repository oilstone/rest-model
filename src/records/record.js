import Path from '../path';
import Blender from '@oilstone/blender';

class Record {
    #model;

    #path;

    #attributes;

    constructor(model) {
        this.#model = model;
        this.#path = new Path(model);

        return new Proxy(
            this,
            {
                get: (target, property) => {
                    console.log('call get on proxy');
                    if (Reflect.has(this, property)) {
                        return Reflect.get(this, property);
                    }

                    return this.#attributes[property];
                },

                set: (target, property, value) => {
                    console.log('call set on proxy');
                    this.#attributes[property] = value;
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
        Object.assign(this, attributes);

        return this;
    }

    $resolve(relation) {
        return this.#model.scope(
            this[this.#model.getPrimaryKey()]
        ).resolve(relation);
    }
}

export default Record;