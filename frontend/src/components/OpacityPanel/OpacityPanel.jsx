import React, { useState } from "react";
import "./OpacityPanel.css";

function OpacityPanel ({setOpacity}) {
  const formattingOpacityValue = (value) => {
    return (value*0.01).toFixed(2);
  }
  

  const [ opacityLevel, setOpacityLevel ] = useState(100);

  function changeOpacity(e){
    e.preventDefault();
    setOpacityLevel(e.target.value);
    setOpacity(formattingOpacityValue(e.target.value));
  }

  return(
    <nav className="opacity-panel">
      <label className="opacity-panel__label">Прозрачность:</label>
      <input className="opacity-panel__input-range" type="range" value={opacityLevel} name="opacity" onChange={(e) => changeOpacity(e)}/>
      <input className="opacity-panel__input-number" type="number" value={opacityLevel} name="opacity" min="0" max="100" onChange={(e) => changeOpacity(e)}/>
    </nav>
  )  
}
export default OpacityPanel;