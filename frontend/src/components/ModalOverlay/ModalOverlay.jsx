import styles from "./ModalOverlay.module.css";

export const ModalOverlay = ({ closeModal = () => {} }) => {
  return <div className={styles.modal_overlay} onClick={closeModal}></div>;
};
