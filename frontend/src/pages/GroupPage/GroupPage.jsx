import { useLocation } from "react-use";
import Navigation from "../../components/Navigation/Navigation";

const GroupPage = () => {
  const location = useLocation();
  console.log(location);
  return (
    <div>
      <Navigation isGroupPage={true}></Navigation>
    </div>
  );
};
export default GroupPage;
