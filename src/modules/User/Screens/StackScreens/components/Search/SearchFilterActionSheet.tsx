import { StyleSheet, Text, View } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Cuisines, Restaurant } from "../../../../../../interfaces";
import { COLORS, theme } from "../../../../../../theme";
import MyButton from "../../../../../../components/MyButton";
import Accordion from "react-native-collapsible/Accordion";
import { Feather } from "@expo/vector-icons";
import MyChip from "../../../../../../components/MyChip";
import MyIconButton from "../../../../../../components/MyIconButton";
type Section = {
  title: string;
  content: ReactNode;
};
const SearchFilterActionSheet = ({
  sheetId,
  payload,
}: SheetProps<{
  restaurants: Restaurant[];
  filters: {
    selectedCuisines: Set<Cuisines>;
  };
}>) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState(
    payload!.filters.selectedCuisines
  );

  const cuisingOptions = useMemo(() => {
    return [
      "Lebanese",
      "Italian",
      "Fast Food",
      "Chinese",
      "Fine Dining",
      "Indian",
      "Mediterranean",
      "Vegetarian",
      "Seafood",
      "Sushi",
      "Steakhouse",
      "Other",
    ] as Cuisines[];
  }, []);
  const SECTIONS = useMemo(
    () =>
      [
        {
          title: "Cuisines",
          content: (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {cuisingOptions.map((cuisine, index) => (
                <MyChip
                  selected={selectedCuisines.has(cuisine)}
                  key={cuisine}
                  title={cuisine}
                  onPress={() => {
                    if (!selectedCuisines.has(cuisine))
                      selectedCuisines.add(cuisine);
                    else selectedCuisines.delete(cuisine);
                    setSelectedCuisines(new Set(selectedCuisines));
                  }}
                />
              ))}
            </View>
          ),
        },
        {
          title: "Ratings",
          content: <Text>Coming Soon</Text>,
        },
      ] as Section[],
    [selectedCuisines]
  );

  const numberOfResults = useMemo(() => {
    let numberOfResults = payload!.restaurants.length;
    if (!selectedCuisines.size)
      return `Show ${numberOfResults} ${
        numberOfResults === 1 ? "Result" : "Results"
      }`;
    numberOfResults = payload!.restaurants.filter((r) => {
      return r.cuisine && selectedCuisines.has(r.cuisine);
    }).length;
    return `Show ${numberOfResults} ${
      numberOfResults === 1 ? "Result" : "Results"
    }`;
  }, [selectedCuisines]);

  const submit = (canceled = false) => {
    SheetManager.hide(sheetId, {
      payload: {
        canceled,
        filters: {
          selectedCuisines,
        },
      },
    });
  };
  const reset = useCallback(() => {
    setSelectedCuisines(new Set());
    SheetManager.hide(sheetId, {
      payload: {
        canceled: false,
        filters: {
          selectedCuisines: new Set(),
        },
      },
    });
  }, [setSelectedCuisines]);

  const _renderHeader = (
    section: Section,
    index: number,
    isActive: boolean
  ) => {
    return (
      <View style={styles.drawerHeader}>
        <Text style={[theme.text.header, { fontSize: 18 }]}>
          {section.title}
        </Text>
        <Feather
          name={!isActive ? "arrow-down" : "arrow-up"}
          size={24}
          color="black"
        />
      </View>
    );
  };

  const _renderContent = (
    section: Section,
    index: number,
    isActive: boolean
  ) => {
    return <View style={{ marginTop: 20 }}>{section.content}</View>;
  };

  const _updateSections = (activeSections: number[]) => {
    setActiveSections(activeSections);
  };
  return (
    <ActionSheet
      id={sheetId}
      gestureEnabled={false}
      enableGesturesInScrollView={true}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[theme.text.subtitle]} onPress={reset}>
            Reset
          </Text>
          <Text style={[theme.text.header]}>Filters</Text>
          <MyIconButton
            icon={<Ionicons name="close" size={24} color="black" />}
            onPress={() => submit(true)}
            containerStyle={undefined}
          />
        </View>

        <View>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            underlayColor={COLORS.WHITE}
          />
        </View>
        <View style={{ marginTop: "auto" }}>
          <MyButton
            type={"Primary"}
            title={numberOfResults}
            onPress={function () {
              submit(false);
            }}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

export default SearchFilterActionSheet;

const styles = StyleSheet.create({
  container: {
    gap: 40,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 15,
    // justifyContent: "space-between",
    minHeight: 500,
    paddingBottom: 10,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
