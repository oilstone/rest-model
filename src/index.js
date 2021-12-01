import RestModel from './rest-model';
import Collectable from './collectable';
import Singleton from './singleton';
import AccessToken from './access-token';
import axios from 'axios';

axios.interceptors.response.use(null, error => {
    if (error.config && error.response && (error.response.status === 401 || error.response.status === 403)) {
        return new Promise(resolve => {
            let token = RestModel.accessToken;

            if (token) {
                token.refresh().then(() => {
                    error.config.headers = RestModel.adapter.headers();
                    resolve(axios.request(error.config));
                });
            }
        });
    }

    return Promise.reject(error);
});

export {
    RestModel,
    Collectable,
    Singleton,
    AccessToken
};

export default RestModel;
