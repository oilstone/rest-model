class Condition {
    static serialize(builder) {
        return `${builder.getColumn()}${this.operator(builder.getOperator())}${this.value(builder.getValue())}`;
    }

    static operator(operator) {
        switch (operator) {
            case '=':
                return '==';
            case '!=':
                return '=!=';
            case '>':
                return '=gt=';
            case '>=':
                return '=gte=';
            case '<':
                return '=lt=';
            case '<=':
                return '=lte=';
            case 'between':
                return '=between=';
            case 'in':
                return '=in=';
            case 'not null':
                return '=not-null=';
            case null:
                return '=null=';
            case 'like':
                return '=like=';
            case 'not in':
                return '=not-in=';
            default:
                return operator;
        }
    }

    static value(value) {
        if (Array.isArray(value)) {
            return `(${value.join()})`;
        }

        return value;
    }
}

export default Condition;
