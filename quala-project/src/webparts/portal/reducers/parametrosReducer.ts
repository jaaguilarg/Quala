import * as actionTypes from '../actions/actionTypes';

const initialState = {
  parametros: [],
  loading: false,
  error: null
};

const parametrosReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_PARAMETROS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_PARAMETROS_SUCCESS:
      return {
        ...state,
        loading: false,
        parametros: action.payload
      };
    case actionTypes.FETCH_PARAMETROS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default parametrosReducer;
