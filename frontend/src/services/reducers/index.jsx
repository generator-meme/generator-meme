import { combineReducers } from "redux";
import { canvasReducer } from "./canvasReducer";
import { currentMemeReducer } from "./currentMemeReducer";
import { savedMemeReducer } from "./savedMemeReducer";
import { userReducer } from "./userReducer";
import { preloaderReducer } from "./preloaderReducer";

const rootReducer = combineReducers({
  canvasData: canvasReducer,
  saveMeme: savedMemeReducer,
  setCurrentMeme: currentMemeReducer,
  user: userReducer,
  preloader: preloaderReducer,
});
export default rootReducer;
