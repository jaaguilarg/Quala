import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import parametrosReducer from '../reducers/parametrosReducer';
import { sitioReducer } from '../reducers/siteReducer';
import paisesReducer from '../reducers/paisReducer';
import userDetailReducer from '../reducers/userDetailReducer';
import nivelAprobacionReducer from '../reducers/nivelAprobacionReducer';

const rootReducer = combineReducers({
  parametros: parametrosReducer,
  sitio: sitioReducer,
  paises: paisesReducer,
  userDetail: userDetailReducer,
  nivelAprobacion: nivelAprobacionReducer,
});

const configureStore = () => {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)
  );
};

export default configureStore;
