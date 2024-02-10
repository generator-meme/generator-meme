import { useState } from "react";
import styles from "./Groups.module.css";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";

export const Groups = () => {
  const widthOfWindow = useGetWidthHook();
  return (
    <div className={styles.groups_wrap}>
      {widthOfWindow > 375 && <h1>Группы</h1>}
    </div>
  );
};
