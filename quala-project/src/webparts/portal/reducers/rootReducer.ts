import { combineReducers } from 'redux';
import parametrosReducer from './parametrosReducer';
import { sitioReducer } from './siteReducer';
import paisesReducer from './paisReducer';
import userDetailReducer from './userDetailReducer';
import nivelAprobacionReducer from './nivelAprobacionReducer';
import termsReducer from './termsReducer';

const rootReducer = combineReducers({
  parametros: parametrosReducer,
  sitio: sitioReducer,
  paises: paisesReducer,
  userDetail: userDetailReducer,
  nivelAprobacion: nivelAprobacionReducer,
  terms: termsReducer
  // otros reducers iran aqu
});

export default rootReducer;
