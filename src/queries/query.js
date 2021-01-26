import Pipeline from '../pipeline';
import Blender from '@oilstone/blender';
import RestModel from "../rest-model";
import Fields from './builders/fields';
import qs from "qs";

class Query {
    #model;

    #path;

    #pipeline;

    #relations = [];

    #fields = {};

    constructor(model, path) {
        this.#model = model;
        this.#path = path;
        this.#pipeline = new Pipeline(model);
        this.#fields = new Fields(model, this.#pipeline);
    }

    get model() {
        return this.getModel();
    }

    getModel() {
        return this.#model;
    }

    get path() {
        return this.getPath();
    }

    getPath() {
        return this.#path;
    }

    get pipeline() {
        return this.getPipeline();
    }

    getPipeline() {
        return this.#pipeline;
    }

    get relations() {
        return this.getRelations();
    }

    getFields() {
        return this.#fields;
    }

    get fields() {
        return this.getFields();
    }

    getRelations() {
        return this.#relations;
    }

    mix(mixins) {
        Blender.on(this).mix(mixins);

        return this;
    }

    include(...relations) {
        relations.forEach(relation => {
            this.#relations.push(
                this.#pipeline.resolve(relation)
            );
        });

        return this;
    }

    select(...pipelines) {
        this.#fields.resolve(pipelines);

        return this;
    }

    buildRequestConfig() {
        return {
            headers: RestModel.adapter.headers(),
            params: RestModel.adapter.params(this),
            paramsSerializer: qs.stringify
        }
    }
}

export default Query;