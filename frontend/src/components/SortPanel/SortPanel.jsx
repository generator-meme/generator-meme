import  "./SortPanel.css";
import React from 'react';
import sort from '../../images/sort.svg'

const FilterSection = () => {
  const handleButtonClick = (buttonNumber) => {
    console.log(`Кнопка ${buttonNumber} нажата`);
    // Здесь можно добавить дополнительную логику обработки нажатия кнопки
  };

  return (
    <section>
      <div className="filter">
      <div className="filter-section-container">
        <button className="button" onClick={() => handleButtonClick(1)}>Популярные</button>
        <button className="button" onClick={() => handleButtonClick(2)}>Новинки</button>
        <button className="button" onClick={() => handleButtonClick(3)}>Рандом</button>
        <button className="button" onClick={() => handleButtonClick(3)}>Избранное</button>
      </div>
      <img className="sort" src={sort.svg} alt="Категории шаблонов."/>
      <PopupContainer isVisible={showPopup}>
        <button>Все шаблоны</button>
        <button>Картинки</button>
        <button>Комиксы</button>
      </PopupContainer>
      </div>
    </section>
  );
};

export default FilterSection;