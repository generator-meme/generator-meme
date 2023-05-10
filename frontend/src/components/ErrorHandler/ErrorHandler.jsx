import styles from "./ErrorHandler.jsx";
import { useState } from "react";
export const ErrorHandler = (err) => {
  const [isOpenWindow, setIsOpenWindow] = useState(false);

  return <div className={styles.wrap_content}></div>;
};
