import Factory from './factory';

class Registry {
    static #items = {};

    static has(name) {
        return typeof Registry.#items[name] !== 'undefined';
    }

    static add(name, item) {
        Registry.#items[name] = item;

        return this;
    }

    static get(name) {
        return Registry.has(name) ? Registry.resolve(name) : null;
    }

    static resolve(name) {
        let item = Registry.#items[name];

        if (typeof item === 'function') {
            item = item(Factory);
            Registry.add(name, item);
        }

        return item;
    }
}

export default Registry;