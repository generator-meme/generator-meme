import React, { useEffect, useState } from "react";

const ExtraImage = ({ image }) => {
  return (
    <div
      style={{
        height: image.height,
        width: image.width,
        position: "absolute",
        top: image.top,
        left: image.left,
      }}
    >
      <img
        src={image.image.currentSrc}
        alt="Дополнительное изображение."
        style={{
          height: image.height,
          width: image.width,
        }}
      />
    </div>
  );
};

export default ExtraImage;
