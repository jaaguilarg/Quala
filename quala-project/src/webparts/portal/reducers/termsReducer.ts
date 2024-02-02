import * as actionTypes from '../actions/actionTypes';

const initialState = {
  terms: [],
  loading: false,
  error: null
};

const termsReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_TERMS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_TERMS_SUCCESS:
      return {
        ...state,
        loading: false,
        terms: action.payload
      };
    case actionTypes.FETCH_TERMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default termsReducer;
