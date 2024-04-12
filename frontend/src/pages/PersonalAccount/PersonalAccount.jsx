import styles from "./PersonalAccount.module.css";
import { ReactComponent as Basket } from "../../images/basket.svg";
import MemeCollection from "../../components/MemeCollection/MemeCollection";
import { Groups } from "../../components/Groups/Groups";
import { PersonalInformation } from "../../components/PersonalInformation/PersonalInformation";
import { HocPersonalAccount } from "../../components/HocPersonalAccount/HocPersonalAccount";

const PersonalAccount = () => {
  return (
    <div className={styles.personal_page}>
      <section>
        <div className={styles.personal_account}>
          <div className={styles.module_wrap}>
            <HocPersonalAccount
              text={"Личная информация"}
              child={<PersonalInformation></PersonalInformation>}
            ></HocPersonalAccount>
            {/* <HocPersonalAccount
              text={"Группы"}
              child={<Groups></Groups>}
            ></HocPersonalAccount> */}
          </div>

          {/* <div className={styles.basket}>
            <h2>Корзина</h2>
            <Basket></Basket>
          </div> */}
        </div>
      </section>
      <section>
        <div className={styles.mobile_style}>
          <HocPersonalAccount
            text={"Коллекция Мемов"}
            child={<MemeCollection></MemeCollection>}
          ></HocPersonalAccount>
        </div>
      </section>
    </div>
  );
};
export default PersonalAccount;
