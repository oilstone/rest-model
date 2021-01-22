import Query from './query';
import RestModel from "../rest-model";

class Singleton extends Query {
    find() {
        this.model.events.fire('fetching', this);

        return this.model.http.get(this.path.resolve(), this.buildRequestConfig()).then(response => {
            let record = this.model.record(RestModel.adapter.unpack(this.model, response));

            this.model.events.fire('fetched', record);

            return record;
        });
    }
}

export default Singleton;