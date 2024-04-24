import { combineReducers } from "redux";
import { savedMemeReducer } from "./savedMemeReducer";
import { userReducer } from "./userReducer";
import { preloaderReducer } from "./preloaderReducer";
import { filtrationReducer } from "./filtrationReducer";
import { memeTemplatesReducer } from "./allMemeTemplatesReducer";
import { teamReducer } from "./teamReducer";
import { filtrationCollectionReducer } from "./filtrationCollectionReducer";
import { allMyMemesCollectionReducer } from "./allMemeCollectionReducer";
import { getTagsReducer } from "./getTagsReducer";
import { getGroupsReducer } from "./groupReducer";
import { memeReducer } from "./memeReducer";

const rootReducer = combineReducers({
  saveMeme: savedMemeReducer,
  user: userReducer,
  preloader: preloaderReducer,
  filtration: filtrationReducer,
  allMemeTemplates: memeTemplatesReducer,

  team: teamReducer,
  collectionFiltration: filtrationCollectionReducer,
  allMyCollectionMemes: allMyMemesCollectionReducer,
  getTags: getTagsReducer,
  getGroups: getGroupsReducer,
  meme: memeReducer,
});
export default rootReducer;
