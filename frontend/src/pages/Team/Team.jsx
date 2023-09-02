import "./Team.css";
import Navigation from "../../components/Navigation/Navigation";
import Teammates from "../../utils/Teammates";

const Team = () => {
  const renderTeam = (teamGroup) => {
    return (
      <div className="team__group">
        <span className="team__group-name">{teamGroup.groupName}</span>
        <ul className="team__group-members-list">
          {teamGroup.teammates.map((person) => {
            return (
              <li className="team__group-member">
                <span className="member__description">{person.desc}</span>
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
    <section className="team">
      <Navigation isSavedMeme={false} id="team" isTeam={true} />
      <div className="team__container">
        {Teammates.map((teamGroup) => renderTeam(teamGroup))}
      </div>
    </section>
  );
};
export default Team;
