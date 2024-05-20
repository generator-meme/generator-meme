import { createPortal } from "react-dom";
import { ModalOverlay } from "../ModalOverlay/ModalOverlay";
import styles from "./Modal.module.css";

export const Modal = ({ children, openModal = true, closeModal }) => {
  const modalNode = document.getElementById("modal");

  return openModal
    ? createPortal(
        <>
          <div className={styles.modal_position}>{children}</div>
          <ModalOverlay closeModal={closeModal}></ModalOverlay>
        </>,
        modalNode
      )
    : null;
};
