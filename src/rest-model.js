import Registry from './registry';
import Adapter from './adapters/json-api/adapter';

class RestModel {
    static #http;
    static #baseUrl = '';
    static #accessToken;
    static #adapter = Adapter;

    static set http(url) {
        RestModel.setHttp(url);
    }

    static get http() {
        return RestModel.getHttp();
    }

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

    static setHttp(http) {
        RestModel.#http = http;
    }

    static getHttp() {
        return RestModel.#http;
    }

    static setAdapter(adapter) {
        RestModel.#adapter = adapter;
    }

    static getAdapter() {
        return RestModel.#adapter;
    }

    static set accessToken(accessToken) {
        RestModel.setAccessToken(accessToken);
    }

    static get accessToken() {
        return RestModel.getAccessToken();
    }

    static setAccessToken(accessToken) {
        RestModel.#accessToken = accessToken;
    }

    static getAccessToken() {
        return RestModel.#accessToken;
    }

    static register(name, callback) {
        Registry.add(name, callback);

        return this;
    }

    static resolve(name) {
        return Registry.get(name);
    }

    static addRequestInterceptor(onFulfilled, onRejected) {
        RestModel.getHttp().interceptors.request.use(onFulfilled, onRejected);
    }

    static addResponseInterceptor(onFulfilled, onRejected) {
        RestModel.getHttp().response.use(onFulfilled, onRejected);
    }
}

export default RestModel;
