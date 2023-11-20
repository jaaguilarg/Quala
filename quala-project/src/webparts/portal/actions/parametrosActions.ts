import * as actionTypes from './actionTypes';
import { PNP } from '../components/Util/util';

export const fetchParametrosRequest = () => ({
  type: actionTypes.FETCH_PARAMETROS_REQUEST
});

export const fetchParametrosSuccess = (parametros:any) => ({
  type: actionTypes.FETCH_PARAMETROS_SUCCESS,
  payload: parametros
  
});

export const fetchParametrosFailure = (error:any) => ({
  type: actionTypes.FETCH_PARAMETROS_FAILURE,
  payload: error
});


export const loadParametros = (context:any) => {
  return async (dispatch:any, getState:any) => {
    const currentData = getState().parametros.parametros;
    
    if (currentData && currentData.length > 0) {
      return; 
    }
    
    dispatch(fetchParametrosRequest());
    
    try {
      const pnp = new PNP(context);
      const data = await pnp.getParameters();
      dispatch(fetchParametrosSuccess(data));
    } catch (error) {
      dispatch(fetchParametrosFailure(error));
    }
    
  }
};