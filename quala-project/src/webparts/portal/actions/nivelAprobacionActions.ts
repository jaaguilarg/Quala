import * as actionTypes from './actionTypes';
import { PNP } from '../components/Util/util';

export const fetchNivelAproRequest = () => ({
  type: actionTypes.FETCH_NIVELAPROBACION_REQUEST
});

export const fetchNivelAproSuccess = (userDetail:any) => ({
  type: actionTypes.FETCH_NIVELAPROBACION_SUCCESS,
  payload: userDetail  
});

export const fetchNivelAproFailure = (error:any) => ({
  type: actionTypes.FETCH_NIVELAPROBACION_FAILURE,
  payload: error
});

export const loadNivelAprobacion = (context:any, id:number) => {
  return async (dispatch:any, getState:any) => {
    const currentData = getState().nivelAprobacion.nivelAprobacion;
        
    if (currentData && currentData.length > 0) {
      return; 
    }
    
    dispatch(fetchNivelAproRequest());
    
    try {
      const pnp = new PNP(context);
      const data = await pnp.getNivelesByPais(id);
      
      dispatch(fetchNivelAproSuccess(data));
     

    } catch (error) {
      dispatch(fetchNivelAproFailure(error));
    }
    
  }
};