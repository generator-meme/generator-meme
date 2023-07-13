// import {
//   POST_NEW_MEME_FAILED,
//   POST_NEW_MEME_REQUEST,
//   POST_NEW_MEME_SUCCESS,
//   IS_OUTSIDE_CALL,
// } from "../actions/canvasActions";

// const initialState = {
//   newMeme: null,
//   isPostMemeRequest: false,
//   error: null,
//   isLoading: true,
//   isOutsideCall: false,
// };

// export const canvasReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case POST_NEW_MEME_REQUEST: {
//       return { ...state, isPostMemeRequest: true };
//     }
//     case POST_NEW_MEME_SUCCESS: {
//       console.log(state);
//       return {
//         ...state,
//         newMeme: action.payload,
//         isPostMemeRequest: false,
//         isLoading: false,
//       };
//     }
//     case POST_NEW_MEME_FAILED: {
//       return {
//         ...state,
//         newMeme: null,
//         isPostMemeRequest: false,
//         error: action.payload,
//       };
//     }
//     case IS_OUTSIDE_CALL: {
//       return { ...state, isOutsideCall: true };
//     }
//     default:
//       return state;
//   }
// };
