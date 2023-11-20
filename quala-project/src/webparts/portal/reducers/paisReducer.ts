import * as actionTypes from '../actions/actionTypes';

const initialState = {
  paises: [],
  loading: false,
  error: null
};

const paisesReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_PAIS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_PAIS_SUCCESS:
      return {
        ...state,
        loading: false,
        paises: action.payload
      };
    case actionTypes.FETCH_PAIS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default paisesReducer;
