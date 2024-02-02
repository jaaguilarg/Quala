import * as actionTypes from './actionTypes';
import { PNP } from '../components/Util/util';

export const fetchTermsRequest = () => ({
  type: actionTypes.FETCH_TERMS_REQUEST
});

export const fetchTermsSuccess = (terms:any) => ({
  type: actionTypes.FETCH_TERMS_SUCCESS,
  payload: terms  
});

export const fetchTermsFailure = (error:any) => ({
  type: actionTypes.FETCH_TERMS_FAILURE,
  payload: error
});

export const loadterms = (context:any) => {
  return async (dispatch:any, getState:any) => {
    const currentData = getState().terms.terms;
        
    if (currentData && currentData.length > 0) {
      return; 
    }
    
    dispatch(fetchTermsRequest());
    
    try {
      const pnp = new PNP(context);
      const data = await pnp.getAllsTermsWithGroups();
      
      dispatch(fetchTermsSuccess(data));
     

    } catch (error) {
      dispatch(fetchTermsFailure(error));
    }
    
  }
};