import React, { useState } from "react";
import "./OpacityPanel.css";

function OpacityPanel ({setOpacity}) {
  const formattingOpacityValue = (value) => {
    return (value*0.01).toFixed(2);
  }
  

  const [ opacityLevel, setOpacityLevel ] = useState(100);
  //
  function enforceMinMax(el) {
    if (el.value != "") {
      if (parseInt(el.value) < parseInt(el.min)) {
        el.value = el.min;
      }
      if (parseInt(el.value) > parseInt(el.max)) {
        el.value = el.max;
      }
    }
  }
  // не доделаны кнопки()
  function decreaseOpacity(e){
    e.preventDefault();
    e.target.parentNode.querySelector('.opacity-panel__input-number').stepDown();
    setOpacityLevel(e.target.parentNode.querySelector('.opacity-panel__input-number').value);
    setOpacity(formattingOpacityValue(e.target.parentNode.querySelector('.opacity-panel__input-number').value));
  }
  function increaseOpacity(e){
    e.preventDefault();
    e.target.parentNode.querySelector('.opacity-panel__input-number').stepUp();
    setOpacityLevel(e.target.parentNode.querySelector('.opacity-panel__input-number').value);
    setOpacity(formattingOpacityValue(e.target.parentNode.querySelector('.opacity-panel__input-number').value));
  }
  function changeOpacity(e){
    e.preventDefault();
    enforceMinMax(e.target);
    setOpacityLevel(e.target.value);
    setOpacity(formattingOpacityValue(e.target.value));
  }

  return(
    <nav className="opacity-panel">
      <label class="opacity-panel__label">Прозрачность:</label>
      <input className="opacity-panel__input-range" type="range" value={opacityLevel} name="opacity" onChange={(e) => changeOpacity(e)}/>
      <div class="opacity-panel__input-number_wrapper">
        <input className="opacity-panel__input-number" type="number" value={opacityLevel} name="opacity" min="0" max="100" onChange={(e) => changeOpacity(e)}/> 
        <button class="opacity-panel__input-number-upBtn" onClick={(e) => increaseOpacity(e)}></button>
        <button class="opacity-panel__input-number-downBtn" onClick={(e) => decreaseOpacity(e)}></button>
      </div>
      
    </nav>
  )  
}
export default OpacityPanel;