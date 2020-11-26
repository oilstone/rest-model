class Pipeline {
    #model;

    constructor(model) {
        this.#model = model;
    }

    pieces(path) {
        let model = this.#model;
        let resolved = [];
        let pieces = path.split('.');

        while (pieces.length) {
            let piece = pieces.shift();
            let relation = model.relations.get(piece);

            if (!relation) {
                resolved.push(piece);
                break;
            }

            resolved.push(relation.type || piece);

            model = relation.foreignModel;
        }

        return resolved;
    }

    resolve(path) {
        return this.pieces(path).join('.');
    }
}

export default Pipeline;