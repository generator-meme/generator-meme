import React, { useState } from "react";
import "./OpacityPanel.css";

function OpacityPanel ({opacity}) {
/*  function Palette({ selectedColor, closePalette }) {
  
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectedColor(e.target.value);
    closePalette();
  };*/

  const [ opacityLevel, setOpacityLevel ] = useState(100);

  function changeOpacity(e){
    e.preventDefault();
    setOpacityLevel(e.target.value);
    console.log(e.target.value * 0.01, opacity)
    opacity(e.target.value * 0.01)
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