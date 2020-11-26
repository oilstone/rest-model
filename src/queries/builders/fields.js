class Fields {
    #items = {};

    #model;

    #pipeline;

    constructor(model, pipeline) {
        this.#model = model;
        this.#pipeline = pipeline;
    }

    get items() {
        return this.getItems();
    }

    getItems() {
        return this.#items;
    }

    resolve(pipelines) {
        pipelines.forEach(pipeline => {
            let pieces = this.#pipeline.pieces(pipeline);
            let field = pieces.pop();
            let type = pieces.length ? pieces.pop() : this.#model.type;

            if (typeof this.#items[type] === 'undefined') {
                this.#items[type] = [];
            }

            this.#items[type].push(field);
        });
    }

    count() {
        return Object.keys(this.#items).length;
    }
}

export default Fields;