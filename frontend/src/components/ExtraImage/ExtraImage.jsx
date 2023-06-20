import React, { useEffect, useState, useRef } from "react";
import "./ExtraImage.css";
import { useLatest } from "react-use";
import { move } from "../../utils/functionsForCanvas.js";

const ExtraImage = ({
  index,
  image,
  imageSizes,
  setImages,
  deleteImageFromArray,
  isCurrentImageIndex,
  setIsCurrentImageIndex,
  deleteCurrentText,
}) => {
  const latestImageValues = useLatest(image);
  const [isHover, setIsHover] = useState(false);
  const picture = useRef(null);
  const deleteImageButton = useRef(null);
  const resizingButton = useRef(null);

  const deleteImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("delete image");
    if (e.target === deleteImageButton.current) {
      deleteImageFromArray();
    }
  };

  const onImageClick = (e) => {
    e.stopPropagation();
    deleteCurrentText();
    if (isCurrentImageIndex !== index) {
      setIsCurrentImageIndex();
    }
  };

  const pickup = (e) => {
    if (!(e.target === picture.current)) return;
    if (latestImageValues.current.isMoving) return;
    if (e.nativeEvent.offsetX > latestImageValues.current.width - 27) return;

    if (e.clientX) {
      setImages({
        ...latestImageValues.current,
        isMoving: true,
        oldX: e.clientX,
        oldY: e.clientY,
      });
    } else {
      setImages({
        ...latestImageValues.current,
        isMoving: true,
        oldX: e.touches[0].clientX,
        oldY: e.touches[0].clientY,
      });
    }
    console.log("pick up image");
  };

  const onMove = (e) => {
    if (latestImageValues.current.isMoving) {
      move(e, latestImageValues.current, setImages);
      console.log("move image");
    }
  };

  const drop = (e) => {
    if (latestImageValues.current.isMoving) {
      setImages({
        ...latestImageValues.current,
        isMoving: false,
        startTop: latestImageValues.current.top,
        startLeft: latestImageValues.current.left,
      });
      console.log("drop image");
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", drop);
    window.addEventListener("touchend", drop, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove, { passive: true });
      window.removeEventListener("mouseup", drop);
      window.removeEventListener("touchend", drop, { passive: true });
    };
  }, []);

  useEffect(() => {
    if (picture.current !== null) {
      const pictureObserved = picture.current;
      const observer = new ResizeObserver(() => {
        setImages({
          ...latestImageValues.current,
          width: picture.current?.offsetWidth,
          height: picture.current?.offsetHeight,
        });
        console.log("observer image", image.id);
      });
      observer.observe(pictureObserved);
      return () => {
        observer.unobserve(pictureObserved);
      };
    }
  }, []);

  return (
    <div
      ref={picture}
      className="extra-image__box"
      style={{
        height: image.heightToWidthRayio * image.width,
        width: image.width,
        top: image.top,
        left: image.left,
        maxHeight: (imageSizes.width / 1.7) * image.heightToWidthRayio,
        maxWidth: imageSizes.width / 1.7,
        backgroundImage: `url(${image.image.currentSrc})`,
        boxShadow:
          isCurrentImageIndex === index || isHover
            ? "2px 2px yellow, 2px -2px yellow, -2px 2px yellow, -2px -2px yellow"
            : "none",
        zIndex: isCurrentImageIndex === index ? 3 : 0,
      }}
      onMouseDown={(e) => pickup(e)}
      onTouchStart={(e) => pickup(e)}
      onClick={(e) => onImageClick(e)}
      onMouseEnter={(e) => setIsHover(true)}
      onMouseLeave={(e) => setIsHover(false)}
    >
      {(isCurrentImageIndex === index || isHover) && (
        <div
          className="image__button-box"
          style={{
            top: 0,
            left: image.width - 27,
          }}
        >
          <button
            ref={deleteImageButton}
            className="image__delete-text"
            onClick={(e) => deleteImage(e)}
          ></button>
          <div ref={resizingButton} className="image__resizer"></div>
        </div>
      )}
    </div>
  );
};

export default ExtraImage;
