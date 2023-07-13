import api from "./api";

export const getTagsOnInputChange = async (name) => {
  try {
    const tagsArray = await api.getTagsWithQueryName(name);
    return tagsArray;
  } catch {
    console.log("err");
  }
};
