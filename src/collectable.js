import Model from './model';
import Query from './queries/collectable';
import Record from './records/collectable';
import Path from "./path";

class Collectable extends Model {
    queryBuilder() {
        return new Query(this, new Path(this));
    }

    newRecord() {
        return new Record(this);
    }

    create(attributes) {
        return this.record(attributes).$save();
    }

    collection(data) {
        return data.map(record => {
            return this.record(record);
        });
    }

    all() {
        return this.query().get();
    }

    destroy(id) {
        return this.newRecord().$fill({id}).$destroy();
    }
}

export default Collectable;
