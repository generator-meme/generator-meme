import { combineReducers } from "redux";
import { canvasReducer } from "./canvasReducer";
import { currentMemeReducer } from "./currentMemeReducer";
import { savedMemeReducer } from "./savedMemeReducer";

const rootReducer = combineReducers({
  canvasData: canvasReducer,
  savedMeme: savedMemeReducer,
  setCurrentMeme: currentMemeReducer,
});
export default rootReducer;
