import * as actionTypes from './actionTypes';


export const setSiteDetails = (details:any) => {
  return (dispatch:any) => {
    return new Promise((resolve, reject) => {
      try {
        dispatch({
          type: actionTypes.SET_IDENTIFICAR_SITIO,
          payload: details
        });
        resolve(details);
      } catch (error) {
        reject(error);
      }
    });
  };
};
