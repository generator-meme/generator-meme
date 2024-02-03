import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPage,
  changeNumberPage,
} from "../../services/actions/collectionFiltrationActions";
import styles from "./PaginationList.module.css";
export const PaginationList = ({ goToPage, arrayOfPages }) => {
  const { page, indexOfPageNumber } = useSelector(
    (state) => state.collectionFiltration
  );
  const dispatch = useDispatch();

  const arr = useMemo(() => {
    if (arrayOfPages?.length < page + 1 || !arrayOfPages) {
      return [];
    }
    return arrayOfPages[page];
  }, [arrayOfPages, page]);

  const decrementOfArrayIndex = (e) => {
    if (page === 0 || arrayOfPages.length === 0) {
      return;
    }
    dispatch(addPage(page - 1));
    goToPage(e, (page - 1) * 5 + 5);
    dispatch(changeNumberPage(4));
  };
  const incrementOfArrayIndex = (e) => {
    if (arrayOfPages.length === page + 1 || arrayOfPages.length === 0) {
      return;
    }
    dispatch(addPage(page + 1));
    goToPage(e, (page + 1) * 5 + 1);
    dispatch(changeNumberPage(0));
  };

  return (
    <div className={styles.pagination_container}>
      <div className={styles.pages}>
        {arrayOfPages?.length !== 0 &&
          arr?.map((numberOfPage, index) => (
            <button
              key={index}
              className={`${styles.btn_no_bg} ${
                indexOfPageNumber === index ? styles.text_bold : null
              }`}
              onClick={(e) => {
                goToPage(e, numberOfPage);
                dispatch(changeNumberPage(numberOfPage - page * 5 - 1));
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
