import styles from "./CreateGroupWindow.module.css";
import { ReactComponent as CloseIcon } from "../../images/icons/close_icon.svg";
import { SearchPanelMobile } from "../searchPanelMobile/SearchPanelMobile";
import { Input } from "../Input/Input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { user } from "../../services/selectors/userSelector";
import { createGroupAction } from "../../services/actions/getGroupsActions";
import { Navigate, useNavigate } from "react-router-dom";
export const CreateGroupWindow = ({ closeModal }) => {
  const [groupName, setGroupName] = useState("");
  const { userInfo } = useSelector(user);
  const navigate = useNavigate();
  const initGroupData = {
    name: "",
    description: "",
    owner: userInfo,
    closed: false,
  };
  const [groupData, setGroupData] = useState(initGroupData);
  const dispatch = useDispatch();

  const handleCreateGroup = () => {
    if (groupData.name === "") {
      return;
    }
    dispatch(createGroupAction(groupData)).then(() => {
      navigate("/me/group");
    });
  };
  const onChange = (e) => {
    e.preventDefault();
    setGroupName(e.target.value);
    setGroupData({ ...groupData, name: groupName });
  };
  console.log(groupName);

  return (
    <div className={styles.container}>
      <div className={styles.close_icon} onClick={closeModal}>
        <CloseIcon style={{ width: "20px", height: "20px" }}></CloseIcon>
      </div>
      <div className={styles.container__main_content}>
        <h2 className={styles.header}>Укажите информацию о группе</h2>
        <div className={styles.button_container}>
          <h3>Название группы</h3>
          <Input name={groupName} onChange={onChange}></Input>
          <button
            className={`${styles.main_content__btn}` + " " + "btn"}
            onClick={handleCreateGroup}
          >
            создать
          </button>
        </div>
      </div>
    </div>
  );
};
