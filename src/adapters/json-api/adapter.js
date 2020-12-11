import Unpacker from './unpacker';
import CollectableQuery from '../../queries/collectable';
import ExpressionSerializer from './serializers/expression';
import RelationSerializer from './serializers/relation';
import SortSerializer from './serializers/sort';
import FieldsSerializer from './serializers/fields';
import TypeConstraint from './serializers/type-constraint';
import Repacker from "./repacker";

class Adapter {
    static unpack(model, response) {
        let unpacker = new Unpacker(model, response);

        switch(unpacker.status()) {
            case 200:
            case 201:
            case 204:
                return unpacker.data();

            default:
                return unpacker.error();
        }
    }

    static repack(type, data) {
        let repacker = new Repacker(type, data);

        return repacker.data();
    }

    static requestConfig() {
        return {
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        }
    }

    static params(query) {
        let params = {};

        if(query.relations.length) {
            params.include = RelationSerializer.serialize(query.relations);
        }

        if(query instanceof CollectableQuery) {
            if(query.filters.count() > 0) {
                params.filter = ExpressionSerializer.serialize(query.filters);
            }

            if(query.fields.count() > 0) {
                params.fields = FieldsSerializer.serialize(query.model, query.fields);
            }

            if(query.orders.count() > 0) {
                params.sort = SortSerializer.serialize(query.model, query.orders);
            }

            if(query.limits.count() > 0) {
                params.limit = TypeConstraint.serialize(query.model, query.limits);
            }

            if(query.offsets.count() > 0) {
                params.offset = TypeConstraint.serialize(query.model, query.offsets);
            }
        }

        return params;
    }
}

export default Adapter;
