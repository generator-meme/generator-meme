import { useState } from "react";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import styles from "./HocPersonalAccount.module.css";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
export const HocPersonalAccount = ({ child, text }) => {
  const widthOfWindow = useGetWidthHook();

  const [reverse, setReverse] = useState(false);
  const isGroup = text === "Группы";
  return widthOfWindow <= 375 ? (
    <>
      <div className={styles.name_dropdown}>
        <h1
          onClick={() => {
            setReverse(!reverse);
          }}
        >
          {text}
        </h1>
        <div
          className={reverse ? styles.unreverse_array : styles.reverse_array}
        >
          <ArrowDown />
        </div>
      </div>
      {reverse && child}
    </>
  ) : (
    child
  );
};
