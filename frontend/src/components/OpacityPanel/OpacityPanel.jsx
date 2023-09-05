import React from "react";
import "./OpacityPanel.css";
import { regExpFromLastCommaToLastRoundBracket } from "../../utils/constants";

function OpacityPanel({ textValues, setTextValues }) {
  const formattingOpacityValue = (value) => {
    return (value * 0.01).toFixed(2);
  };

  function enforceMinMax(el) {
    if (el.value !== "") {
      if (parseInt(el.value) < parseInt(el.min)) {
        el.value = el.min;
      }
      if (parseInt(el.value) > parseInt(el.max)) {
        el.value = el.max;
      }
    }
  }

  const setNewOpacity = (opacity) => {
    if (textValues.backColor !== "transparent") {
      let replacedColor = textValues.backColor.replace(
        regExpFromLastCommaToLastRoundBracket,
        `,${formattingOpacityValue(opacity)})`
      );
      setTextValues({
        ...textValues,
        backColor: replacedColor,
        opacity: formattingOpacityValue(opacity),
        opacityLevel: opacity,
      });
    } else {
      setTextValues({
        ...textValues,
        opacity: formattingOpacityValue(opacity),
        opacityLevel: opacity,
      });
    }
  };

  function decreaseOpacity(e) {
    e.preventDefault();
    const target = e.target.parentNode.querySelector(
      ".opacity-panel__input-number"
    );
    target.stepDown();
    setNewOpacity(target.value);
  }

  function increaseOpacity(e) {
    e.preventDefault();
    const target = e.target.parentNode.querySelector(
      ".opacity-panel__input-number"
    );
    target.stepUp();
    setNewOpacity(target.value);
  }

  function changeOpacity(e) {
    e.preventDefault();
    enforceMinMax(e.target);
    setNewOpacity(e.target.value);
  }

  return (
    <nav className="opacity-panel">
      <label class="opacity-panel__label">Прозрачность:</label>
      <input
        className="opacity-panel__input-range"
        type="range"
        value={textValues.opacityLevel}
        name="opacity"
        onChange={(e) => changeOpacity(e)}
      />
      <div class="opacity-panel__input-number_wrapper">
        <input
          className="opacity-panel__input-number"
          type="number"
          value={textValues.opacityLevel}
          name="opacity"
          min="0"
          max="100"
          onChange={(e) => changeOpacity(e)}
        />
        <button
          class="opacity-panel__input-number-upBtn"
          onClick={(e) => increaseOpacity(e)}
        ></button>
        <button
          class="opacity-panel__input-number-downBtn"
          onClick={(e) => decreaseOpacity(e)}
        ></button>
      </div>
    </nav>
  );
}
export default OpacityPanel;
