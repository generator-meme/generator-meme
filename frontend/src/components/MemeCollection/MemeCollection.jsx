import styles from "./MemeCollection.module.css";
import {
  addPage,
  getPage,
} from "../../services/actions/collectionFiltrationActions";
import { useState, useEffect, useMemo } from "react";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import button_delete from "../../images/cross-delete.png";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMemeFromMyCollection,
  getAllMyMemeCollections,
  setAllMemeCollectionsEmpty,
} from "../../services/actions/allMemeCollectionActions";
import {
  changeFlag,
  searchTag,
  addOrdering,
  addLimit,
  addOffset,
} from "../../services/actions/collectionFiltrationActions";
import { TagLists } from "../TagLists/TagLists";
import { PaginationList } from "../PaginationList/PaginationList";
import { useNavigate } from "react-router-dom";
import { BLOCK_SAVE_BUTTON_TO_COLLECTION } from "../../services/actions/savedMemeActions";
import { getArrayOfNumberPages } from "../../utils/memeCollectionUtils";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { SearchPanelMobile } from "../searchPanelMobile/SearchPanelMobile";

export default function MemeCollection() {
  const [search, setSearch] = useState("");
  const { tags } = useSelector((state) => state.getTags);
  const dispatch = useDispatch();
  const myMemes = useSelector((state) => state.allMyCollectionMemes.myMemes);
  const { template_tag, offset, ordering, only_my, limit } = useSelector(
    (state) => state.collectionFiltration.queryParam
  );
  const { flag } = useSelector((state) => state.collectionFiltration);
  const [reverse, setReverse] = useState(false);
  const navigate = useNavigate();
  const widthOfWindow = useGetWidthHook();

  const limitOnPage = useMemo(() => {
    if (widthOfWindow <= 1480 && widthOfWindow > 1080) {
      return 4;
    } else if (widthOfWindow <= 1080 && widthOfWindow > 750) {
      return 2;
    } else if (widthOfWindow <= 750 && widthOfWindow > 250) {
      return 4;
    } else return 4;
  }, []);

  useEffect(() => {
    dispatch(addLimit(limitOnPage));
  }, []);

  const ArrayOFPages = useMemo(() => {
    const blockPages = Math.ceil(myMemes?.count / limit);
    if (!myMemes || myMemes.count === 0 || blockPages === 0) {
      return [];
    }
    const slicedArrayes = getArrayOfNumberPages([], blockPages);
    return slicedArrayes;
  }, [myMemes]);

  // useEffect(() => {}, [myMemes]);

  useEffect(() => {
    dispatch(getAllMyMemeCollections());
  }, [template_tag, offset, ordering, only_my, dispatch, flag]);

  const stringToSearch = () => {
    if (search === "") {
      return "";
    }

    const tempTags = tags;
    const tagId = tempTags.find((tag) => {
      return tag.name === search;
    });
    return tagId ? tagId.id : "noID";
  };
  //get id of Tag from all tags in templates

  const handleChangeSearch = (e) => {
    const search_string = e.target.value;
    const query_string = search_string.toLocaleLowerCase().trim();
    setSearch(query_string);
  };

  // to remove , and '' from search string

  const SortEverything = (e) => {
    e.preventDefault();
    const searchString = stringToSearch();
    if (searchString === "noID") {
      dispatch(setAllMemeCollectionsEmpty());
      return;
    } else {
      dispatch(searchTag(searchString));
      dispatch(addPage(0));
      dispatch(changeFlag());
    }
  };
  // function to search of tags

  const reverseMemes = () => {
    setReverse(!reverse);
    ordering === "added_at"
      ? dispatch(addOrdering("-added_at"))
      : dispatch(addOrdering("added_at"));
  };
  //added ordering by date in query in api.getMemesInMyCollection

  const goToPage = (e, numberOfPage) => {
    e.preventDefault();
    if (stringToSearch() === "noID") {
      return;
    }
    dispatch(addOffset((numberOfPage - 1) * limit));
  };
  //add offset to query in api.getMemesInMyCollection

  const handleGoToMeme = (id) => {
    navigate(`/saved/${id}`);
  };
  // go to saved meme

  return (
    <div className={styles.meme_collection}>
      <div className={styles.header_row}>
        {widthOfWindow <= 375 ? null : <h1>Коллекция мемов</h1>}
        <div className={styles.collection_search}>
          <SearchPanelMobile
            SortEverything={SortEverything}
            handleChangeSearch={handleChangeSearch}
            search={search}
          ></SearchPanelMobile>
        </div>

        <button
          className={`${styles.sortByDate} ${styles.btn_no_bg}`}
          onClick={(e) => reverseMemes(e)}
        >
          По дате
          <div
            className={reverse ? styles.unreverse_array : styles.reverse_array}
          >
            <ArrowDown />
          </div>
        </button>
      </div>
      <div className={styles.memes_container}>
        {myMemes?.results?.map((res) => {
          return (
            <div className={styles.one_meme}>
              <button
                onClick={(e) => {
                  dispatch(deleteMemeFromMyCollection(res.meme.id));
                }}
                className={`${styles.delete_btn} ${styles.btn_no_bg}`}
              >
                <img
                  className={styles.cross}
                  src={button_delete}
                  alt="delete"
                />
              </button>
              <img
                className={styles.saved_meme_img}
                src={res.meme.image}
                alt=""
                onClick={() => {
                  handleGoToMeme(res.meme.id);
                  dispatch({ type: BLOCK_SAVE_BUTTON_TO_COLLECTION });
                }}
              />
              <TagLists elem={res.meme.template}></TagLists>
            </div>
          );
        })}
      </div>
      <PaginationList
        goToPage={goToPage}
        arrayOfPages={ArrayOFPages}
      ></PaginationList>
    </div>
  );
}
