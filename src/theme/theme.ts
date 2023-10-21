import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export interface Theme {
  text: {
    color: string;
    fontFamily: {
      normal: string;
      bold: string;
      bolder: string;
    };
    header: {
      fontSize: number;
      fontFamily: string;
      fontWeight:
        | "normal"
        | "bold"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
      color: string;
    };
    headerLight: {
      primaryColor: string;
      secondaryColor: string;
      fontSize: number;
      fontWeight:
        | "normal"
        | "bold"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
    };
    subHeaderLight: {
      primaryColor: string;
      secondaryColor: string;
      fontSize: number;
      fontWeight:
        | "normal"
        | "bold"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
    };
    title: {
      primaryColor: string;
      secondaryColor: string;
      fontSize: number;
    };
    subtitle: {
      color: string;
      fontSize: number;
    };
  };
  buttons: {
    primary: {
      backgroundColor: string;
      color: string;
    };
  };
  links: {
    primaryColor: string;
    secondaryColor: string;
    fontSize: number;
  };
  backgroundColor: string;
  primaryColor: string;
  screen: {
    largePaddingHorizontal: number;
    paddingHorizontal: number;
    paddingBottom: number;
    paddingTop: number;
    marginTop: number;
  };
  tabBar: {
    iconColor: string;
    iconColorActive: string;
    height: number;
  };
  borderRadius: {
    soft: number;
  };
  shadow: {
    softer: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;

      elevation: number;
    };
    soft: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;

      elevation: number;
    };
  };
}

const PALETTE_1: Theme = {
  text: {
    color: COLORS.LIGHT_BLACK,
    fontFamily: {
      normal: "Roboto_400Regular,",
      bold: "Roboto_500Medium,",
      bolder: "Roboto_700Bold,",
    },
    header: {
      fontWeight: "700",
      fontFamily: "Roboto_700Bold",
      fontSize: 28,
      color: COLORS.LIGHT_BLACK,
    },
    headerLight: {
      primaryColor: COLORS.DARK_BLACK,
      secondaryColor: "",
      fontSize: 25,
      fontWeight: "300",
    },
    subHeaderLight: {
      primaryColor: COLORS.DARK_BLACK,
      secondaryColor: "",
      fontSize: 18,
      fontWeight: "300",
    },
    title: {
      primaryColor: COLORS.DARK_BLACK,
      secondaryColor: "",
      fontSize: 14,
    },
    subtitle: {
      color: COLORS.LIGHT_GRAY,
      fontSize: 15,
    },
  },
  buttons: {
    primary: {
      backgroundColor: COLORS.GREEN,
      color: COLORS.WHITE,
    },
  },
  links: {
    primaryColor: COLORS.DARK_BLACK,
    secondaryColor: "",
    fontSize: 12,
  },
  backgroundColor: COLORS.WHITE,
  primaryColor: COLORS.GREEN,
  screen: {
    largePaddingHorizontal: 45,
    paddingHorizontal: 10,
    paddingBottom: 30,
    paddingTop: 45,
    marginTop: 0,
  },
  tabBar: {
    iconColor: "gray",
    iconColorActive: COLORS.GREEN,
    height: 60,
  },
  borderRadius: {
    soft: 5,
  },
  shadow: {
    soft: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    softer: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
  },
};
const baseText = { fontFamily: "Roboto_300Light" };
const baseTextBolder = { fontFamily: "Roboto_400Regular" };
export const theme = PALETTE_1;
export const globalStyles = StyleSheet.create({
  baseText,
  baseTextBolder,
  headerText: {
    ...baseText,
    color: theme.text.header.color,
    fontSize: 30,
    textAlign: "center",
    marginVertical: 15,
  },
  headerLight: {
    ...baseText,
    color: theme.text.headerLight.primaryColor,
    fontSize: theme.text.headerLight.fontSize,
    fontWeight: theme.text.headerLight.fontWeight,
  },
  subHeaderLight: {
    ...baseText,
    color: theme.text.subHeaderLight.primaryColor,
    fontSize: theme.text.subHeaderLight.fontSize,
    fontWeight: theme.text.subHeaderLight.fontWeight,
  },
  label: {
    ...baseText,
    color: COLORS.DARK_BLACK,
    fontSize: theme.text.title.fontSize,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    paddingTop: theme.screen.paddingTop,
  },
  scrollContainer: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: theme.screen.paddingHorizontal,
    gap: 10,
    paddingBottom: 10,
    width: "100%",
    minHeight: "100%",
  },
  borderedMainContent: {
    // backgroundColor: COLORS.LIGHT_BLUE,
    // borderRadius: 20,
    padding: 15,
    // minHeight: "90%",
  },
  chip: {
    //box shadow
    shadowColor: "#a5a5a5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
    borderRadius: 20,
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: COLORS.WHITE,
    width: "auto",
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: theme.borderRadius.soft,
    ...theme.shadow.softer,
    padding: 10,
    fontWeight: "600",
  },
  textInputContainer: {
    backgroundColor: "white",
    borderRadius: theme.borderRadius.soft,
    ...theme.shadow.softer,
    padding: 10,
    paddingRight: 25,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInputLabel: {
    color: theme.text.color,
    fontFamily: theme.text.fontFamily.bold,
    fontWeight: "600",
    fontSize: 15,
  },
  textInputErrorLabel: {
    textAlign: "right",
    color: theme.primaryColor,
    fontSize: 12,
  },
});

//tomato red : {theme.primaryColor}
