class Select {
    static serialize(model, fields, relations) {
        let serialized = {};
        let items = fields.items;

        if (!relations.length && fields.count() === 1 && typeof items[model.type] !== 'undefined') {
            return items[model.type].join();
        }

        for (let type in items) {
            serialized[type] = items[type].join();
        }

        return serialized;
    }
}

export default Select;