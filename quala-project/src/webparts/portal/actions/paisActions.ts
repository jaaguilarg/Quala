import * as actionTypes from './actionTypes';
import { PNP } from '../components/Util/util';

export const fetchPaisesRequest = () => ({
  type: actionTypes.FETCH_PAIS_REQUEST
});

export const fetchPaisesSuccess = (paises:any) => ({
  type: actionTypes.FETCH_PAIS_SUCCESS,
  payload: paises
  
});

export const fetchPaisesFailure = (error:any) => ({
  type: actionTypes.FETCH_PAIS_FAILURE,
  payload: error
});

export const loadPaises = (context:any) => {
  return async (dispatch:any, getState:any) => {
    const currentData = getState().paises.paises;
        
    if (currentData && currentData.length > 0) {
      return; 
    }
    
    dispatch(fetchPaisesRequest());
    
    try {
      const pnp = new PNP(context);
      const data = await pnp.getListItemsRoot("Paises",["*"],"","");
      console.log(data);
      
      dispatch(fetchPaisesSuccess(data));
     

    } catch (error) {
      dispatch(fetchPaisesFailure(error));
    }
    
  }
};