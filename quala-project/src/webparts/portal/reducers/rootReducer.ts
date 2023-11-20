import { combineReducers } from 'redux';
import parametrosReducer from './parametrosReducer';
import { sitioReducer } from './siteReducer';
import paisesReducer from './paisReducer';
import userDetailReducer from './userDetailReducer';
import nivelAprobacionReducer from './nivelAprobacionReducer';

const rootReducer = combineReducers({
  parametros: parametrosReducer,
  sitio: sitioReducer,
  paises: paisesReducer,
  userDetail: userDetailReducer,
  nivelAprobacion: nivelAprobacionReducer,
  // otros reducers irían aquí
});

export default rootReducer;
