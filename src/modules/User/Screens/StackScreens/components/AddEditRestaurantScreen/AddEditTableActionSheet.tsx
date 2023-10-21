import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import MyButton from "../../../../../../components/MyButton";
import React, { useCallback, useMemo, useState } from "react";
import {
  TABLE_LOCATION,
  TABLE_STATUS,
  TABLE_TYPE,
  TableLocationType,
  TableStatusType,
  TableTypeType,
} from "../../../../../../interfaces";
import MyTextInput from "../../../../../../components/MyTextInput";
import { Dropdown } from "react-native-element-dropdown";
import Table from "../../../../../../interfaces/Table";

interface TableForm {
  uid?: string;
  capacity?: number;
  tableName?: string;
  location?: TableLocationType;
  type?: TableTypeType;
  status?: TableStatusType;
}

function AddEditTableActionSheet({
  sheetId,
  payload,
}: SheetProps<{
  table?: Table;
  index: number;
}>) {
  const [table, setTable] = useState<TableForm>(
    payload?.table
      ? { ...payload?.table }
      : {
          capacity: 0,
          tableName: "",
          location: "",
          type: "",
          status: "",
        }
  );
  const [errors, setErrors] = useState<{
    capacity?: { message: string };
    tableName?: { message: string };
    location?: { message: string };
    type?: { message: string };
    status?: { message: string };
  }>({});
  const [openDropdownFields, setOpenDropdownFields] = useState<{
    location: boolean;
    type: boolean;
    status: boolean;
  }>({ location: false, type: false, status: false });
  const handleChange = useCallback(
    (field: keyof typeof errors, value: string) => {
      const newErrors = { ...errors };
      setTable({ ...table, [field]: value });
      if (value.trim()) {
        delete newErrors[field];
        setErrors(newErrors);
      }
    },
    [errors, table]
  );
  const handleSubmit = useCallback(
    (table: TableForm | null) => {
      SheetManager.hide(sheetId, {
        payload: {
          canceled: table === null,
          data: table,
          index: payload?.index || -1,
        },
      });
    },
    [payload]
  );

  const getData = useCallback((field: keyof typeof openDropdownFields) => {
    switch (field) {
      case "location":
        return Object.entries(TABLE_LOCATION).map((s) => ({
          label: s[1],
          value: s[1],
        }));
      case "status":
        return Object.entries(TABLE_STATUS).map((s) => ({
          label: s[1],
          value: s[1],
        }));
      case "type":
        return Object.entries(TABLE_TYPE).map((s) => ({
          label: s[1],
          value: s[1],
        }));
    }
  }, []);
  return (
    <ActionSheet
      id={sheetId}
      closable={true}
      gestureEnabled={true}
      enableGesturesInScrollView={false}
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.title}>Add Table</Text>
          </View>

          <MyTextInput
            value={table.capacity}
            type="Numpad"
            onChange={(e) => {
              handleChange("capacity", e);
            }}
            title={"Capacity"}
            placeholder={"Capacity of your table"}
          />
          <MyTextInput
            value={table.tableName}
            type="Text"
            onChange={(e) => {
              handleChange("tableName", e);
            }}
            title={"Table name or identifier"}
            placeholder={"Table name or identifier"}
          />
          {Object.keys(openDropdownFields).map((field: string) => (
            <Dropdown
              key={field}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={getData(field as keyof typeof openDropdownFields)}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={`Select table ${field}`}
              searchPlaceholder="Search..."
              value={table[field as keyof typeof openDropdownFields]}
              // onFocus={() => setIsFocus(true)}
              // onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setTable({ ...table, [field]: item.value });
                // setValue(item.value);
                // setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color={isFocus ? 'blue' : 'black'}
              //     name="Safety"
              //     size={20}
              //   />
              // )}
            />
          ))}
        </View>
        <View style={styles.actions}>
          <MyButton
            type={"Primary"}
            title={"Confirm"}
            onPress={() => handleSubmit(table)}
          />
          <MyButton
            type={"Secondary"}
            title={"Cancel"}
            onPress={() => handleSubmit(null)}
          />
        </View>
      </View>
    </ActionSheet>
  );
}

export default React.memo(AddEditTableActionSheet);

const styles = StyleSheet.create({
  container: {
    gap: 40,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 15,
    justifyContent: "space-between",
    height: 600,
  },
  top: {
    gap: 15,
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
  actions: {
    gap: 20,
    paddingHorizontal: 10,
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "#d1cdcd",
    borderRadius: 5,
    padding: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
