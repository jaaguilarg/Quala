import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userDetail: [],
  loading: false,
  error: null
};

const userDetailReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_USERDETAIL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_USERDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetail: action.payload
      };
    case actionTypes.FETCH_USERDETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userDetailReducer;
