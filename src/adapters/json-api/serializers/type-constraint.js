class TypeConstraint {
    static serialize(model, typeConstraint) {
        let items = typeConstraint.items;

        if (typeConstraint.count() === 1 && typeof items[model.type] !== 'undefined') {
            return items[model.type];
        }

        return items;
    }
}

export default TypeConstraint;