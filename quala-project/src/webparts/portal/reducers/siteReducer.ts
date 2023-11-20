import { SET_IDENTIFICAR_SITIO } from "../actions/actionTypes";

const initialState = {
  sitiopaso: '',
  urlSite: '',
  urlSiteSubsitio: '',
  urlPrimerSitio: '',
  urlSitioPrincipal: '',
  sitioPrincipal: '',
  estadoSitio: false
};

export function sitioReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_IDENTIFICAR_SITIO:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
