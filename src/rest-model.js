import Registry from './registry';
import Adapter from './adapters/json-api/adapter';

class RestModel {
    static #baseUrl = '';
    static #adapter = Adapter;

    static set baseUrl(url) {
        RestModel.setBaseUrl(url);
    }

    static get baseUrl() {
        return RestModel.getBaseUrl();
    }

    static setBaseUrl(url) {
        RestModel.#baseUrl = url;
    }

    static getBaseUrl() {
        return RestModel.#baseUrl;
    }

    static set adapter(adapter) {
        RestModel.setAdapter(adapter);
    }

    static get adapter() {
        return RestModel.getAdapter();
    }

    static setAdapter(adapter) {
        RestModel.#adapter = adapter;
    }

    static getAdapter() {
        return RestModel.#adapter;
    }

    static register(name, callback) {
        Registry.add(name, callback);

        return this;
    }

    static resolve(name) {
        return Registry.get(name);
    }
}

export default RestModel;