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
  const [page, setPage] = useState(1);
  const [widthScreen, setWidthScreen] = useState(window.screen.width);

  useEffect(() => {
    dispatch(getAllMyMemeCollections());
  }, [template_tag, offset, ordering, only_my, limit, dispatch, flag]);

  useEffect(() => {
    let pageArray = [];
    const pageC = Math.ceil(myMemes?.count / memesPerPage);
    for (let i = 1; i <= pageC; i++) {
      pageArray.push(i);
    }
    if (!pageArray) {
      return [];
    }
    let tempPages = pageArray;
    const slicedArrayes = sliceArrayIntoGroups(tempPages, 5);
    dispatch(getPage(slicedArrayes));
  }, [myMemes]);

  const memesPerPage = useMemo(() => {
    let memes_per_page = 9 * page;
    switch (true) {
      case window.screen.width <= 1480 && window.screen.width > 1080:
        memes_per_page = 4 * page;
        break;
      case window.screen.width <= 1080 && window.screen.width > 750:
        memes_per_page = 2 * page;
        // isTagsShown = false;
        break;
      case window.screen.width <= 750 && window.screen.width > 350:
        memes_per_page = 4 * page;
        // isTagsShown = true;
        // sortByDate = true;
        break;
      default:
        break;
    }
    return memes_per_page;
  }, []);

  function sliceArrayIntoGroups(arr, size) {
    if (arr.length === 0) {
      return arr;
    }
    return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
  }

  // const pageCount = useMemo(() => {
  //   let pageArray = [];
  //   const pageC = Math.ceil(myMemes?.count / memesPerPage);
  //   for (let i = 1; i <= pageC; i++) {
  //     pageArray.push(i);
  //   }
  //   return pageArray;
  // }, [myMemes]);

  // const pageCount2dArray = useMemo(() => {
  //   let pageArray = [];
  //   const pageC = Math.ceil(myMemes?.count / memesPerPage);
  //   for (let i = 1; i <= pageC; i++) {
  //     pageArray.push(i);
  //   }
  //   if (!pageArray) {
  //     return [];
  //   }
  //   let tempPages = pageArray;
  //   const slicedArrayes = sliceArrayIntoGroups(tempPages, 5);

  //   return slicedArrayes;
  // }, [myMemes]);

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

  const handleChangeSearch = (e) => {
    const search_string = e.target.value;
    const query_string = search_string.replaceAll(" ", ",");
    setSearch(query_string);
  };

  const SortEverything = (e) => {
    e.preventDefault();
    const searchString = stringToSearch();

    if (searchString === "") {
      dispatch(clearQueryParam());
      dispatch(changeFlag()); //триггер для вызова useEffect
      return;
    }
    if (searchString !== "noID") {
      dispatch(searchTag(searchString));
    } else {
      dispatch(setAllMemeCollectionsEmpty());
    }
  };
  const reverseMemes = () => {
    setReverse(!reverse);
    ordering === "added_at"
      ? dispatch(addOrdering("-added_at"))
      : dispatch(addOrdering("added_at"));
  };

  const goToPage = (e, page) => {
    e.preventDefault();
    dispatch(addOffset((page - 1) * limit));
  };

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
        {myMemes?.results?.map((res) => (
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
              />
              <TagLists elem={res.meme.template}></TagLists>
            </div>
          </>
        ))}
      </div>

      <PaginationList
        // pages={pageCount2dArray}
        goToPage={goToPage}
      ></PaginationList>
    </div>
  );
}

<>
  {/* {savedMemes?.count >= memesPerPage && (
      <button
        className={`${styles.btn_no_bg}  ${styles.pages}`}
        // onClick={(e) => showMore(e)}
      >
        Показать больше
      </button>
    )} */}
</>;

const handleReverseMemesCollection = () => {};
// const showMore = (e) => {
//   e.preventDefault();
//   setMemesPerPageGlobal((memesPerPage *= 2));
//   ShowFirstPageOfSavedMemes();
// };
// const reverseMemes = (e) => {
//   e.preventDefault();
//   //  const [ toReverseMemes, setToReverseMemes] = useState(false);
//   setToReverseMemes(!toReverseMemes);
//   ShowFirstPageOfSavedMemes(
//     searchID,
//     (currentPage - 1) * memesPerPage,
//     toReverseMemes ? "-added_at" : "added_at"
//   );

//   const svgArr = document.getElementById("transformed");
//   if (toReverseMemes) {
//     svgArr.style.transform = "rotate(180deg)";
//     svgArr.style.color = "#AC52D1";
//   } else {
//     svgArr.style.transform = "rotate(0deg)";
//     svgArr.style.color = "black";
//   }
// };
// const deleteMemeFromCollection = async (meme_id) => {
//   const savedToken = getCookie("token");
//   console.log();
//   await api.deleteMemeFromMyCollection(meme_id, savedToken); //удаление перманетно, до появления корзины
//   ShowFirstPageOfSavedMemes(searchID, (currentPage - 1) * memesPerPage);
// };
// const ShowFirstPageOfSavedMemes = async (
//   //делает запрос на сервер для подгрузки коллекции мемов
//   search_text = "",
//   offset = 0,
//   ordering = "-added_at"
// ) => {
//   const savedToken = getCookie("token");
//   const result = await api.getMemesInMyCollection(
//     search_text,
//     memesPerPage,
//     offset,
//     "true",
//     savedToken,
//     ordering
//   );
//   console.log(result);
//   setSavedMemes(result);
// };
// подгружает вторую подборку мемов в зависимости от offset
// const goToPage = (e, page) => {
//   e.preventDefault();
//   ShowFirstPageOfSavedMemes(search, (page - 1) * memesPerPage);
//   setCurrentPage(page);
// };
