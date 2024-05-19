import { createPortal } from "react-dom";

export const Modal = ({ children, openModal = true, closeModal }) => {
  const modalNode = document.getElementById("modal");

  return openModal
    ? createPortal(<div onClick={closeModal}>{children}</div>, modalNode)
    : null;
};
