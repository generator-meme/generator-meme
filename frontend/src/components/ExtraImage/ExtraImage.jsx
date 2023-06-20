import React, { useEffect, useState, useRef } from "react";
import "./ExtraImage.css";
import { useLatest } from "react-use";

const ExtraImage = ({ image, imageSizes, images, setImages }) => {
  const latestImageValues = useLatest(image);
  const [isCurrent, setIsCurrent] = useState(true);
  const picture = useRef(null);
  const deleteImageButton = useRef(null);

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
        boxShadow: isCurrent
          ? "2px 2px yellow, 2px -2px yellow, -2px 2px yellow, -2px -2px yellow"
          : "none",
      }}
    >
      {isCurrent && (
        <>
          <button
            ref={deleteImageButton}
            className="image__delete-text"
            style={{
              top: 2,
              left: image.width - 21,
            }}
            // onClick={(e) => deleteText(e)}
          ></button>
          <div
            className="image__resizer"
            style={{
              top: image.height - 27 - 21,
              left: image.width - 27,
            }}
          ></div>
        </>
      )}
      {/* <img
        //   className="extra-image"
        src={image.image.currentSrc}
        alt="Дополнительное изображение."
        height={image.height}
        width={image.width}
        style={{
          //   height: image.height,
          //   width: image.width,
          maxHeight: imageSizes.height / 3,
          maxWidth: imageSizes.width / 3,
          //   top: image.top,
          //   left: image.left,
        }}
      /> */}
    </div>
  );
};

export default ExtraImage;
