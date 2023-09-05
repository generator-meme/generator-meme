import "./Preloader.css";

const Preloader = () => {
  return (
    <>
      <div className="preloader__container">
        <p className="preloader__text">Загрузка...</p>
      </div>
      <div className="preloader__container preloader__container_type_transparent">
        <div className="preloader__circle"></div>
      </div>
    </>
  );
};

export default Preloader;
