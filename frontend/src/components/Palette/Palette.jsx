import React from 'react';
import './Palette.css';

function Palette({ selectedColor, closePalette }) {
  function hexToRgb(hex) {
    // проверяем хекс ли это
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // если хекс то возвращаем значение в формате RGB строка вида: "0-255,0-255,0-255" если нет, то возвращаем аргумент без изменений
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : hex;
  }
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectedColor(hexToRgb(e.target.value));
    closePalette();
  };

  return (
      <nav className="color-palette">
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_000000" value="#000000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_444444" value="#444444" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_666666" value="#666666" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_999999" value="#999999" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_CCCCCC" value="#CCCCCC" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_EEEEEE" value="#EEEEEE" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_F3F3F3" value="#F3F3F3" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FFFFFF" value="#FFFFFF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FF0000" value="#FF0000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FF9900" value="#FF9900" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FFFF00" value="#FFFF00" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_00FF00" value="#00FF00" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_00FFFF" value="#00FFFF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_0000FF" value="#0000FF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_9900FF" value="#9900FF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FF00FF" value="#FF00FF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_F4CCCC" value="#F4CCCC" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FCE5CD" value="#FCE5CD" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FFF2CC" value="#FFF2CC" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_D9EAD3" value="#D9EAD3" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_D0E0E3" value="#D0E0E3" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_CFE2F3" value="#CFE2F3" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_D9D2E9" value="#D9D2E9" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_EAD1DC" value="#EAD1DC" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_EA9999" value="#EA9999" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_F9CB9C" value="#F9CB9C" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FFE599" value="#FFE599" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_B6D7A8" value="#B6D7A8" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_A2C4C9" value="#A2C4C9" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_9FC5E8" value="#9FC5E8" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_B4A7D6" value="#B4A7D6" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_D5A6BD" value="#D5A6BD" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_E06666" value="#E06666" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_F6B26B" value="#F6B26B" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_FFD966" value="#FFD966" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_93C47D" value="#93C47D" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_76A5AF" value="#76A5AF" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_6FA8DC" value="#6FA8DC" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_8E7CC3" value="#8E7CC3" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_C27BA0" value="#C27BA0" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_CC0000" value="#CC0000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_E69138" value="#E69138" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_F1C232" value="#F1C232" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_6AA84F" value="#6AA84F" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_45818E" value="#45818E" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_3D85C6" value="#3D85C6" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_674EA7" value="#674EA7" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_A64D79" value="#A64D79" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_990000" value="#990000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_B45F06" value="#B45F06" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_BF9000" value="#BF9000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_38761D" value="#38761D" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_134F5C" value="#134F5C" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_0B5394" value="#0B5394" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_351C75" value="#351C75" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_741B47" value="#741B47" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_660000" value="#660000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_783F04" value="#783F04" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_7F6000" value="#7F6000" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_274E13" value="#274E13" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_0C343D" value="#0C343D" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_073763" value="#073763" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_20124D" value="#20124D" onClick= {e => onClick(e)}/>
        <input type="radio" name="colorpaletteColor" class="color-palette__color color-palette__color_4C1130" value="#4C1130" onClick= {e => onClick(e)}/>        
      </nav>)
}

export default Palette;