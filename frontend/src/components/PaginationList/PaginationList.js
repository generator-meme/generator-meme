import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPage } from "../../services/actions/collectionFiltrationActions";
import styles from "./PaginationList.module.css";
export const PaginationList = ({ goToPage }) => {
  const { page, pageArray } = useSelector(
    (state) => state.collectionFiltration
  );
  console.log(page);
  const [isActive, setIsActive] = useState(0);
  const dispatch = useDispatch();
  const myMemes = useSelector((state) => state.allMyCollectionMemes.myMemes);
  useEffect(() => {}, [pageArray]);
  console.log(isActive);
  const arr = useMemo(() => {
    if (pageArray.length < page + 1) {
      return [];
    }
    return pageArray[page];
  }, [pageArray, page]);

  const decrementOfArrayIndex = (e) => {
    console.log(JSON.stringify(page));
    if (page === 0) {
      goToPage(e, 5);
      return;
    }
    dispatch(addPage(page - 1));
    goToPage(e, (page - 1) * 5 + 5);
  };
  const incrementOfArrayIndex = (e) => {
    if (pageArray.length === page + 1) {
      return;
    }
    dispatch(addPage(page + 1));
    goToPage(e, (page + 1) * 5 + 1);
  };

  return (
    <div className={styles.pagination_container}>
      <div className={styles.pages}>
        {pageArray.length !== 0 &&
          arr.map((numberOfPage, index) => (
            <button
              key={index}
              className={`${styles.btn_no_bg} ${
                isActive === index ? styles.text_bold : null
              }`}
              onClick={(e) => {
                if (numberOfPage >= 5) {
                  setIsActive(0);
                }
                goToPage(e, numberOfPage);
                setIsActive(numberOfPage - page * 5 - 1);
              }}
            >
              {numberOfPage}
            </button>
          ))}
      </div>
      <div className={styles.arrow_container}>
        <div
          onClick={(e) => {
            decrementOfArrayIndex(e);
          }}
        >
          {"<<"}
        </div>
        <div
          onClick={(e) => {
            incrementOfArrayIndex(e);
          }}
        >
          {">>"}
        </div>
      </div>
    </div>
  );
};
