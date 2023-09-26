import "./Team.css";
import Navigation from "../../components/Navigation/Navigation";
import Teammates from "../../utils/Teammates";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeamAction } from "../../services/actions/teamAction";
import cat from "../../images/teamPage/bgc.svg";
const Team = () => {
  const dispatch = useDispatch();
  const { team } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(getTeamAction());
  }, []);

  const renderTeam = (teamGroup) => {
    return (
      <div className="team__group">
        <span className="team__group-name">{teamGroup.name}</span>
        <ul className="team__group-members-list">
          {teamGroup.teammates.map((person) => {
            return (
              <li className="team__group-member">
                <span className="member__description">
                  {person.description}
                </span>
                <a
                  className={`member__name ${
                    person.link === "" ? "member__name--no-link" : ""
                  }`}
                  href={person.link}
                  target="_blank"
                >
                  {person.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  return (
    !!Teammates && (
      <section className="team">
        <Navigation isSavedMeme={false} id="team" isTeam={true} />
        <div className="team__container">
          {Teammates.map((teamGroup) => renderTeam(teamGroup))}

          {/* <div className="team__container__grid-two">
            <div className="img_container">
              <img className="cat_img" src={cat} alt="cat" />
            </div>
          </div> */}
        </div>
      </section>
    )
  );
};
export default Team;
