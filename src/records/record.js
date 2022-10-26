import Path from '../path';
import Collection from '../collection';
import Blender from '@oilstone/blender';

class Record {
    _model;

    _path;

    _meta = {};

    _attributes = {};

    _relations = {};

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

    get $meta() {
        return this.$getMeta();
    }

    $getMeta() {
        return this._meta;
    }

    set $meta(meta) {
        return this.$setMeta(meta);
    }

    $setMeta(meta) {
        this._meta = meta;

        return this;
    }

    get $attributes() {
        return this.$getAttributes();
    }

    $getAttributes() {
        return this._attributes;
    }

    $getAttribute(name) {
        return this.$attributes[name];
    }

    $hasAttribute(name) {
        return typeof this.$attributes[name] !== 'undefined';
    }

    $removeAttribute(name) {
        delete this._attributes[name];

        return this;
    }

    $setAttribute(name, value) {
        if (this.$attributes[name] !== value) {
            this.$attributes[name] = value;

            this._dirty = true;
        }

        return true;
    }

    get $relations() {
        return this.$getRelations();
    }

    $getRelations() {
        return this._relations;
    }

    $getRelation(name) {
        return this.$relations[name];
    }

    $setRelation(name, value) {
        this._relations[name] = value;

        return true;
    }

    $hasRelation(name) {
        return typeof this.$relations[name] !== 'undefined';
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

    $toObjectPrimitive() {
        const primitive = Object.assign({}, this.$attributes);

        primitive.$meta = this._meta;

        for (let key in this._relations) {
            if (this._relations[key] instanceof Collection) {
                primitive[key] = this._relations[key].toArrayPrimitive();

                continue;
            }

            primitive[key] = this._relations[key].$toObjectPrimitive();
        }

        return primitive;
    }
}

export default Record;
