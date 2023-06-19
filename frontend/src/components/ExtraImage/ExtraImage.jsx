import React, { useEffect, useState, useRef } from "react";
import "./ExtraImage.css";
import { useLatest } from "react-use";

const ExtraImage = ({ image, imageSizes, images, setImages }) => {
  const latestImageValues = useLatest(image);
  const [isCurrent, setIsCurrent] = useState(true);
  const picture = useRef(null);

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
        height: image.height,
        width: image.width,
        top: image.top,
        left: image.left,
        maxHeight: imageSizes.height / 1.7,
        maxWidth: imageSizes.width / 1.7,
        backgroundImage: `url(${image.image.currentSrc})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxShadow: isCurrent
          ? "2px 2px yellow, 2px -2px yellow, -2px 2px yellow, -2px -2px yellow"
          : "none",
      }}
    >
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
