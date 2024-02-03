export const SET_CURRENT_MEME = "SET_CURRENT_MEME";
export const SET_SAVED_MEME = "SET_SAVED_MEME";

export const setCurrentMemeAction = (current_meme) => ({
  type: SET_CURRENT_MEME,
  payload: current_meme,
});
export const setSavedMemeAction = (saved_meme) => ({
  type: SET_SAVED_MEME,
  payload: saved_meme,
});
