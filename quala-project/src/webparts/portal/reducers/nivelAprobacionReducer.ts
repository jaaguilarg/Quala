import * as actionTypes from '../actions/actionTypes';

const initialState = {
  nivelAprobacion: [],
  loading: false,
  error: null
};

const nivelAprobacionReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_NIVELAPROBACION_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_NIVELAPROBACION_SUCCESS:
      return {
        ...state,
        loading: false,
        nivelAprobacion: action.payload
      };
    case actionTypes.FETCH_NIVELAPROBACION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default nivelAprobacionReducer;
