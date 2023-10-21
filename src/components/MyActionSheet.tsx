import { Button, StyleSheet, Text, View } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import MyButton from "./MyButton";

function ConfirmSheet({
  sheetId,
  payload,
}: SheetProps<{
  title: string;
  message?: string;
  confirmText?: string;
  rejectText?: string;
}>) {
  return (
    <ActionSheet id={sheetId} gestureEnabled={true} closable={true}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}>{payload?.title}</Text>
          {payload?.message && (
            <Text style={styles.subTitle}>{payload?.message}</Text>
          )}
        </View>
        <View style={styles.bottom}>
          <MyButton
            type="Primary"
            title={payload?.confirmText || "Confirm"}
            onPress={() => {
              SheetManager.hide(sheetId, {
                payload: true,
              });
            }}
          />
          <MyButton
            type="Secondary"
            title={payload?.rejectText || "Cancel"}
            onPress={() => {
              SheetManager.hide(sheetId, {
                payload: false,
              });
            }}
          />
        </View>
      </View>
    </ActionSheet>
  );
}

export default ConfirmSheet;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  top: {
    gap: 5,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  bottom: {
    gap: 15,
  },
});
