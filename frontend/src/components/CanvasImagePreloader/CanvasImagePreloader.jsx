import React, { useState, useEffect } from "react";
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
  const [fontSize, setFontSize] = useState(40);
  const [outsideTextHeight, setOusideTextHeight] = useState(80);
  const [imageSizes, setImageSizes] = useState(null);
  const [canvasSizes, setCanvasSisez] = useState({
    width: 657,
    height: 556,
  });

  useEffect(() => {
    // масштабирование шаблона в рамки канваса, подстраивание канваса под размеры масштабированной картинки
    if (image) {
      const sizes = contain(
        canvasSizes.width,
        canvasSizes.height,
        image.naturalWidth,
        image.naturalHeight
      );
      setImageSizes(sizes);
    }
  }, [image, canvasSizes]);

  const handleOnBeforeUnload = (event) => {
    event.preventDefault();
    return (event.returnValue = "");
  };

  const updateCanvasSisez = () => {
    if (window.innerWidth > 1140) {
      setCanvasSisez({
        width: 657,
        height: 556,
      });
    } else {
      setCanvasSisez({
        width: window.innerWidth * 0.87,
        height: window.innerWidth * 0.68,
      });
    }
  };

  const updateFontSise = () => {
    if (window.innerWidth > 700) {
      setFontSize(40);
    } else if (window.innerWidth > 570) {
      setFontSize(30);
    } else {
      setFontSize(25);
    }
  };

  const updateOutsideTextHeight = () => {
    if (window.innerWidth > 700) {
      setOusideTextHeight(80);
    } else if (window.innerWidth > 570) {
      setOusideTextHeight(70);
    } else {
      setOusideTextHeight(60);
    }
  };

  const onUpdateWidth = () => {
    updateCanvasSisez();
    updateOutsideTextHeight();
  };

  useEffect(() => {
    onUpdateWidth();
    updateFontSise();

    window.addEventListener("resize", onUpdateWidth);

    return () => {
      window.removeEventListener("resize", onUpdateWidth);
    };
  }, []);

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
      imageSizes={imageSizes}
      image={image}
      canvasSizes={canvasSizes}
      fontSize={fontSize}
      outsideTextHeight={outsideTextHeight}
    />
  );
};

export default CanvasImagePreloader;
