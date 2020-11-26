class Sort {
    static serialize(model, orders) {
        let serialized = {};
        let items = orders.items;

        if (orders.count() === 1 && typeof items[model.type] !== 'undefined') {
            return Sort.format(items[model.type]);
        }

        for (let type in items) {
            serialized[type] = Sort.format(items[type]);
        }

        return serialized;
    }

    static format(items) {
        let formatted = [];

        for (let item in items) {
            formatted.push(
                items[item] === 'desc' ? `-${item}` : item
            )
        }

        return formatted.join();
    }
}

export default Sort;