export const fontFamilyOptions = {
  roboto: "Roboto",
  oswald: "Oswald",
  notoSans: "Noto Sans",
  montserrat: "Montserrat",
  playfairDisplay: "Playfair Display",
  arial: "Arial",
  timesNewRoman: "Times New Roman",
  pacifico: "Pacifico",
  balsamiqSans: "Balsamiq Sans",
};

export const optionsList = [
  fontFamilyOptions.roboto,
  fontFamilyOptions.oswald,
  fontFamilyOptions.notoSans,
  fontFamilyOptions.montserrat,
  fontFamilyOptions.playfairDisplay,
  fontFamilyOptions.arial,
  fontFamilyOptions.timesNewRoman,
  fontFamilyOptions.pacifico,
  fontFamilyOptions.balsamiqSans,
];

export const createExtraText = (imageSizes) => {
  return {
    name: "extraTextValues",
    isOutside: false,
    isCurrent: false,
    isVisible: true,
    hover: false,
    text: "",
    fontSize: 40,
    fontFamily: fontFamilyOptions.roboto,
    selectedOption: 0,
    fontPosition: "center",
    fontWeight: false,
    fontStyle: false,
    fillTextColor: "black",
    strokeTextColor: "transparent",
    underline: false,
    lineThrough: false,
    backColor: "transparent",
    opacity: 1,
    opacityLevel: 100,
    width: imageSizes?.width,
    maxWidth: imageSizes?.width,
    textAreaWidth: 0,
    height: 70,
    top: imageSizes?.height / 2,
    left: 0,
    bottom: null,
    startTop: 0,
    startLeft: 0,
    isMoving: false,
    oldX: null,
    oldY: null,
  };
};

export const regExpFromLastCommaToLastRoundBracket =
  /\,(?=[^,]*$)([\s\S]+?)\)(?=[^)]*$)/g;
