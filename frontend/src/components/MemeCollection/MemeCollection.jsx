import api from "../../utils/api";
import styles from "./MemeColection.module.css";
import {
  addPage,
  getPage,
} from "../../services/actions/collectionFiltrationActions";
import Tag from "./Tag";
import { getCookie } from "../../utils/cookie";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";
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
  clearQueryParam,
  searchTag,
  addOrdering,
  addLimit,
  addOffset,
} from "../../services/actions/collectionFiltrationActions";
import { TagLists } from "../TagLists/TagLists";
import { PaginationList } from "../PaginationList/PaginationList";
import { useNavigate } from "react-router-dom";
import { BLOCK_SAVE_BUTTON_TO_COLLECTION } from "../../services/actions/savedMemeActions";

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
  let isTagsShown = true;
  let sortByDate = true;
  // const { page, pageArray, indexOfPageNumber } = useSelector(
  //   (state) => state.collectionFiltration
  // );
  // const [page, setPage] = useState(1);
  const [widthScreen, setWidthScreen] = useState(window.screen.width);
  const navigate = useNavigate();

  const memesPerPage = useMemo(() => {
    let memes_per_page = 4;

    switch (true) {
      case window.screen.width <= 1480 && window.screen.width > 1080:
        memes_per_page = 4;
        break;
      case window.screen.width <= 1080 && window.screen.width > 750:
        memes_per_page = 2;
        // isTagsShown = false;
        break;
      case window.screen.width <= 750 && window.screen.width > 350:
        memes_per_page = 4;
        // isTagsShown = true;
        // sortByDate = true;
        break;
      default:
        break;
    }
    return memes_per_page;
  }, []);
  console.log(memesPerPage);

  useEffect(() => {
    dispatch(getAllMyMemeCollections());
  }, [
    template_tag,
    offset,
    ordering,
    only_my,
    limit,
    dispatch,
    flag,
    memesPerPage,
  ]);

  useEffect(() => {
    let pageArray = [];
    const pageC = Math.ceil(myMemes?.count / memesPerPage);
    if (pageC === 0) {
      return [];
    }
    for (let i = 1; i <= pageC; i++) {
      pageArray.push(i);
    }
    const slicedArrayes = sliceArrayIntoGroups(pageArray, 5);
    dispatch(getPage(slicedArrayes));
  }, [myMemes]);

  useEffect(() => {
    dispatch(addLimit(memesPerPage));
  }, [dispatch, memesPerPage]);

  function sliceArrayIntoGroups(arr, size) {
    if (arr.length === 0) {
      return arr;
    }
    return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
  }

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
    const query_string = search_string.replaceAll(" ", ",").toLocaleLowerCase();
    setSearch(query_string);
  };
  // to remove , and '' from search string

  const SortEverything = (e) => {
    e.preventDefault();
    const searchString = stringToSearch();
    if (searchString === "") {
      dispatch(clearQueryParam());
      dispatch(changeFlag()); // to get allMycollections with initial
      //query parametrs in api.getMemesInMyCollection;
      return;
    }
    if (searchString !== "noID") {
      dispatch(searchTag(searchString));
      dispatch(addPage(0));
    } else {
      dispatch(setAllMemeCollectionsEmpty());
    }
    dispatch(addPage(0));
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
        <h1>Коллекция мемов</h1>
        <div className={styles.search_component}>
          <input
            onChange={handleChangeSearch}
            value={search}
            className={`${styles.text_style} ${styles.search_input}`}
            placeholder="Поиск"
          />
          <button
            className={`${styles.search_button} ${styles.btn_no_bg}`}
            onClick={(e) => SortEverything(e)}
          >
            <SearchButton />
          </button>
        </div>
        {sortByDate && (
          <button
            className={`${styles.sortByDate} ${styles.btn_no_bg}`}
            onClick={(e) => reverseMemes(e)}
          >
            По дате
            <div
              className={
                reverse ? styles.unreverse_array : styles.reverse_array
              }
            >
              <ArrowDown />
            </div>
          </button>
        )}
        {!isTagsShown && (
          <div className={`${styles.text_style} ${styles.btn_no_bg}`}>
            Сортировать
          </div>
        )}
      </div>
      <div className={styles.memes_container}>
        {myMemes?.results?.map((res) => {
          return (
            <>
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
            </>
          );
        })}
      </div>

      <PaginationList goToPage={goToPage}></PaginationList>
    </div>
  );
}
