import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "../Canvas/Canvas";
import { contain } from "../../utils/imagesFunctions";

const CanvasImagePreloader = ({
  currentMeme,
  handleCreateNewMeme,
  setIsNewMeme,
  isNewMeme,
  memes,
  setImageNotFoundOpen,
}) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const imageSizes = useMemo(() => {
    if (image) {
      return contain(675, 556, image.naturalWidth, image.naturalHeight); // масштабирование шаблона в рамки канваса, подстраивание канваса под размеры масштабированной картинки
    }
    return null;
  }, [image]);

  const handleOnBeforeUnload = (event) => {
    event.preventDefault();
    return (event.returnValue = "");
  };

  useEffect(() => {
    if (!currentMeme && localStorage.getItem("currentMeme") === null) {
      setImageNotFoundOpen(true);
      navigate("/");
      return;
    }

    const img = new Image(); // создаем изображеиние только при первом рендере, затем оно будет храниться в стейте
    if (currentMeme) {
      img.src = currentMeme.image;
    } else if (JSON.parse(localStorage.getItem("currentMeme")) !== null) {
      img.src = JSON.parse(localStorage.getItem("currentMeme")).image;
    }
    img.addEventListener("load", () => {
      setImage(img);
    });

    if (localStorage.getItem("currentMeme") === null) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleOnBeforeUnload);
      };
    }
  }, []);

  if (!image || !imageSizes) {
    return null;
  }

  return (
    <Canvas
      currentMeme={currentMeme}
      handleCreateNewMeme={handleCreateNewMeme}
      setIsNewMeme={setIsNewMeme}
      isNewMeme={isNewMeme}
      memes={memes}
      setImageNotFoundOpen={setImageNotFoundOpen}
      imageSizes={imageSizes}
      image={image}
    />
  );
};

export default CanvasImagePreloader;
