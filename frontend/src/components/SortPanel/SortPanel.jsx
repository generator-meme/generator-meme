import  "./SortPanel.css";
import React from 'react';
import sort from '../../images/sort1.png'

const ButtonSection = () => {
  const handleButtonClick = (buttonNumber) => {
    console.log(`Кнопка ${buttonNumber} нажата`);
    // Здесь можно добавить дополнительную логику обработки нажатия кнопки
  };

  return (
    <section>
      <div className="container">
      <div className="button-section-container">
        <button className="button" onClick={() => handleButtonClick(1)}>Популярные</button>
        <button className="button" onClick={() => handleButtonClick(2)}>Новинки</button>
        <button className="button" onClick={() => handleButtonClick(3)}>Рандом</button>
        <button className="button">Избранное</button>
      </div>
      <img className="sort" src={sort1.png} alt="Категории шаблонов."/>
      <PopupContainer isVisible={showPopup}>
        <Button>Все шаблоны</Button>
        <Button>Картинки</Button>
        <Button>Комиксы</Button>
      </PopupContainer>
      </div>
    </section>
  );
};

export default ButtonSection;