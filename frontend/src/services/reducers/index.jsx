import { combineReducers } from "redux";
import { canvasReducer } from "./canvasReducer";

const rootReducer = combineReducers({ canvasData: canvasReducer });
export default rootReducer;
