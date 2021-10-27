import Path from '../path';
import Blender from '@oilstone/blender';

class Record {
    _model;

    _path;

    _attributes = {};

    _dirty = false;

    constructor(model) {
        this._model = model;
        this._path = new Path(model);

        return new Proxy(
            this,
            {
                get: (target, property) => {
                    if (Reflect.has(target, property)) {
                        return Reflect.get(target, property);
                    }

                    return target.$getAttribute(property);
                },

                set: (target, property, value) => {
                    return target.$setAttribute(property, value);
                }
            }
        );
    }

    get $model() {
        return this.$getModel();
    }

    $getModel() {
        return this._model;
    }

    get $path() {
        return this.$getPath();
    }

    $getPath() {
        return this._path;
    }

    get $attributes() {
        return this.$getAttributes();
    }

    $getAttributes() {
        return this._attributes;
    }

    $getAttribute(property) {
        return this.$attributes[property];
    }

    $setAttribute(property, value) {
        if (this.$attributes[property] !== value) {
            this.$attributes[property] = value;

            this._dirty = true;
        }

        return true;
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
        return this._model.scope(
            this.$attributes[this._model.getPrimaryKey()]
        ).resolve(relation);
    }
}

export default Record;
