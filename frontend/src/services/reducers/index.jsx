import { combineReducers } from "redux";
import { canvasReducer } from "./canvasReducer";
import { currentMemeReducer } from "./currentMemeReducer";
import { savedMemeReducer } from "./savedMemeReducer";
import { userReducer } from "./userReducer";
import { preloaderReducer } from "./preloaderReducer";
import { filtrationReducer } from "./filtrationReducer";
import { memeTemplatesReducer } from "./allMemeTemplatesReducer";

const rootReducer = combineReducers({
  canvasData: canvasReducer,
  saveMeme: savedMemeReducer,
  setCurrentMeme: currentMemeReducer,
  user: userReducer,
  preloader: preloaderReducer,
  filtration: filtrationReducer,
  allMemeTemplates: memeTemplatesReducer,
});
export default rootReducer;
