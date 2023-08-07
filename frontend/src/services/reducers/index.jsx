import { combineReducers } from "redux";
import { canvasReducer } from "./canvasReducer";
import { currentMemeReducer } from "./currentMemeReducer";
import { savedMemeReducer } from "./savedMemeReducer";
import { userReducer } from "./userReducer";

const rootReducer = combineReducers({
  canvasData: canvasReducer,
  savedMeme: savedMemeReducer,
  setCurrentMeme: currentMemeReducer,
  user: userReducer,
});
export default rootReducer;
