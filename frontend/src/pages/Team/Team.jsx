import "./Team.css";
import Navigation from "../../components/Navigation/Navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeamAction } from "../../services/actions/teamAction";

const Team = () => {
  const dispatch = useDispatch();
  const { team } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(getTeamAction());
  }, []);

  const renderTeam = (team) => {
    return (
      <div className="team__group">
        <span className="team__group-name">{team.name}</span>
        <ul className="team__group-members-list">
          {team.teammates.map((person) => {
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
    !!team && (
      <section className="team">
        <Navigation isSavedMeme={false} id="team" isTeam={true} />
        <div className="team__container">
          {team.map((teamGroup) => renderTeam(teamGroup))}
        </div>
      </section>
    )
  );
};
export default Team;
