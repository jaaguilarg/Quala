import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import parametrosReducer from '../reducers/parametrosReducer';
import { sitioReducer } from '../reducers/siteReducer';
import paisesReducer from '../reducers/paisReducer';
import userDetailReducer from '../reducers/userDetailReducer';
import nivelAprobacionReducer from '../reducers/nivelAprobacionReducer';
import termsReducer from '../reducers/termsReducer';

const rootReducer = combineReducers({
  parametros: parametrosReducer,
  sitio: sitioReducer,
  paises: paisesReducer,
  userDetail: userDetailReducer,
  nivelAprobacion: nivelAprobacionReducer,
  terms: termsReducer,
});

const configureStore = () => {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)
  );
};

export default configureStore;
