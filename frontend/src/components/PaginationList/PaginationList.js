import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPage,
  changeNumberPage,
} from "../../services/actions/collectionFiltrationActions";
import styles from "./PaginationList.module.css";
export const PaginationList = ({ goToPage }) => {
  const { page, pageArray, indexOfPageNumber } = useSelector(
    (state) => state.collectionFiltration
  );
  const dispatch = useDispatch();

  const arr = useMemo(() => {
    if (pageArray.length < page + 1) {
      return [];
    }
    return pageArray[page];
  }, [pageArray, page]);

  const decrementOfArrayIndex = (e) => {
    if (page === 0 || pageArray.length === 0) {
      return;
    }
    dispatch(addPage(page - 1));
    goToPage(e, (page - 1) * 5 + 5);
    dispatch(changeNumberPage(4));
  };
  const incrementOfArrayIndex = (e) => {
    if (pageArray.length === page + 1 || pageArray.length === 0) {
      return;
    }
    dispatch(addPage(page + 1));
    goToPage(e, (page + 1) * 5 + 1);
    dispatch(changeNumberPage(0));
  };

  return (
    <div className={styles.pagination_container}>
      <div className={styles.pages}>
        {pageArray.length !== 0 &&
          arr.map((numberOfPage, index) => (
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
