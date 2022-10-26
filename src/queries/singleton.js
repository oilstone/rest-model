import Query from './query';
import RestModel from "../rest-model";

class Singleton extends Query {
    find() {
        this.model.events.fire('fetching', this);

        return this.model.http.get(this.path.resolve(), this.buildRequestConfig()).then(response => {
            let record = this.model.hydrateOne(RestModel.adapter.unpack(this.model, response));

            this.model.events.fire('fetched', record);

            return record;
        }).catch(error => {
            throw RestModel.adapter.unpack(this.$model, error.response);
        });
    }
}

export default Singleton;
