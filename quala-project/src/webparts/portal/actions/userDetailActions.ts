import * as actionTypes from './actionTypes';
import { PNP } from '../components/Util/util';

export const fetchUserDetailRequest = () => ({
  type: actionTypes.FETCH_USERDETAIL_REQUEST
});

export const fetchUserDetailSuccess = (userDetail:any) => ({
  type: actionTypes.FETCH_USERDETAIL_SUCCESS,
  payload: userDetail  
});

export const fetchUserDetailFailure = (error:any) => ({
  type: actionTypes.FETCH_USERDETAIL_FAILURE,
  payload: error
});

export const loadUser = (context:any, id:number) => {
  return async (dispatch:any, getState:any) => {
    const currentData = getState().userDetail.userDetail;
        
    if (currentData && currentData.length > 0) {
      return; 
    }
    
    dispatch(fetchUserDetailRequest());
    
    try {
      const pnp = new PNP(context);
      const data = await pnp.getRolByUser(id);
      
      dispatch(fetchUserDetailSuccess(data));
     

    } catch (error) {
      dispatch(fetchUserDetailFailure(error));
    }
    
  }
};