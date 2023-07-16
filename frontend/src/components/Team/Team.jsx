import "./Team.css";
import Navigation from "../Navigation/Navigation";
import { useEffect, useState } from "react";
import api from "../../utils/api";
const Team = () => {
  const [team, setTeam] = useState([])
  useEffect(()=>{
    api.getTeam()
    .then(res => setTeam(res))
  },[])
  const renderTeam = (teamGroup) => {
    return (
      <div className="team__group">
        <span className="team__group-name">{teamGroup.name}</span>
        <ul className="team__group-members-list">
          {teamGroup.teammates.map((person) => {
            return (
              <li className="team__group-member">
                <span className="member__description">{person.description}</span>
                <a
                  className={`member__name ${person.link === '' ? 'member__name--no-link': ''}`}
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
        {team.map(teamGroup => renderTeam(teamGroup))}
      </div>
    </section>
  );
};
export default Team;
