import Model from './model';
import Query from './queries/singleton';
import Record from './records/singleton';
import Path from "./path";

class Singleton extends Model {
    queryBuilder() {
        return new Query(this, new Path(this));
    }

    newRecord() {
        return new Record(this);
    }
}

export default Singleton;