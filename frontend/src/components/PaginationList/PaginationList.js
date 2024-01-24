import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPage } from "../../services/actions/collectionFiltrationActions";
import styles from "./PaginationList.module.css";
export const PaginationList = ({ goToPage }) => {
  const { page, pageArray } = useSelector(
    (state) => state.collectionFiltration
  );
  const [isActive, setIsActive] = useState(null);
  const dispatch = useDispatch();
  const getItem = (page) => {
    setIsActive(page);
  };
  const arr = useMemo(() => {
    if (pageArray.length < page + 1) {
      return [];
    }
    return pageArray[page];
  }, [pageArray, page]);

  const decrementOfArrayIndex = () => {
    if (page === 0) {
      return;
    }
    dispatch(addPage(page - 1));
  };
  const incrementOfArrayIndex = () => {
    if (pageArray.length === page + 1) {
      return;
    }
    dispatch(addPage(page + 1));
  };

  return (
    <div className={styles.pagination_container}>
      <div className={styles.pages}>
        {pageArray.length !== 0 &&
          arr.map((page, index) => (
            <button
              key={index}
              className={`${styles.btn_no_bg} ${
                isActive === page ? styles.text_bold : ""
              }`}
              onClick={(e) => {
                goToPage(e, page);
                getItem(page);
              }}
            >
              {page}
            </button>
          ))}
      </div>
      <div className={styles.arrow_container}>
        <div onClick={() => decrementOfArrayIndex()}>{"<<"}</div>
        <div onClick={() => incrementOfArrayIndex()}>{">>"}</div>
      </div>
    </div>
  );
};
