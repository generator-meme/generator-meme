import { combineReducers } from "redux";
import { currentMemeReducer } from "./currentMemeReducer";
import { savedMemeReducer } from "./savedMemeReducer";
import { userReducer } from "./userReducer";
import { preloaderReducer } from "./preloaderReducer";
import { filtrationReducer } from "./filtrationReducer";
import { memeTemplatesReducer } from "./allMemeTemplatesReducer";
import { favoriteTemplatesReducer } from "./favoriteTemplatesReducer";
import { teamReducer } from "./teamReducer";

const rootReducer = combineReducers({
  saveMeme: savedMemeReducer,
  setCurrentMeme: currentMemeReducer,
  user: userReducer,
  preloader: preloaderReducer,
  filtration: filtrationReducer,
  allMemeTemplates: memeTemplatesReducer,
  favoriteTemplates: favoriteTemplatesReducer,
  team: teamReducer,
});
export default rootReducer;
