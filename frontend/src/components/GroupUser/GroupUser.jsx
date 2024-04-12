import styles from "./GroupUser.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
export const GroupUser = ({ name }) => {
  const widthOfWindow = useGetWidthHook();
  return (
    <div className={`${styles.name}`}>
      <p>{name}</p>
      <div className={`${styles.close_icon}`}>{<CloseIcon />}</div>
    </div>
  );
};
