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

                    return target.$attributes[property];
                },

                set: (target, property, value) => {
                    if (target.$attributes[property] !== value) {
                        target.$attributes[property] = value;

                        target._dirty = true;
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