import AccessToken from './access-token';
import Collectable from './collectable';
import CollectableRecord from './records/collectable';
import Path from './path';
import RestModel from './rest-model';
import Singleton from './singleton';
import axios from 'axios';

axios.interceptors.response.use(null, error => {
    if (error.config && error.response && error.response.status === 401) {
        return new Promise(resolve => {
            let token = RestModel.accessToken;

            if (token) {
                token.refresh().then(() => {
                    resolve(axios.request(error.config));
                });
            }
        });
    }

    return Promise.reject(error);
});

export {
    AccessToken,
    Collectable,
    CollectableRecord,
    Path,
    RestModel,
    Singleton,
};

export default RestModel;
