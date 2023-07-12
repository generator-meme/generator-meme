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
    fontSize: window.innerWidth > 700 ? 40 : window.innerWidth > 570 ? 30 : 25,
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
    top:
      imageSizes?.height / 2 -
      (window.innerWidth > 700 ? 40 : window.innerWidth > 570 ? 35 : 30),
    left: 0,
    bottom: null,
    startTop: imageSizes?.height / 2 - 40,
    startLeft: 0,
    isMoving: false,
    oldX: null,
    oldY: null,
  };
};

export const updateOutideText = (top, imageSizes) => {
  return {
    name: top ? "outsideTopTextValues" : "outsideBottomTextValues",
    isOutside: true,
    isCurrent: false,
    isVisible: true,
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
    height: 80,
    top: top ? -80 : null,
    left: 0,
    bottom: top ? null : -80,
    canvasTop: top ? 0 : null,
    canvasLeft: 0,
    canvasBottom: top ? null : 0,
  };
};

export const regExpFromLastCommaToLastRoundBracket =
  /\,(?=[^,]*$)([\s\S]+?)\)(?=[^)]*$)/g;

export const checkEmailMessage = {
  signinSuccess: {
    title: "Вы успешно зарегистрировались!",
    text: "На вашу электронную почту отправлено письмо. Перейдите по ссылке в письме для завершения успешной регистрации.",
    maxWidth: "100%",
    back: "/signin",
  },
  changePasswordMessage: {
    title: "На вашу электронную почту отправлено письмо. ",
    text: "Перейдите по ссылке в письме для сохранения нового пароля на сайте.",
    maxWidth: 460,
    back: "",
  },
};
