import { registerSheet } from "react-native-actions-sheet";
import MyActionSheet from "../components/MyActionSheet";
import AddEditTableActionSheet from "../modules/User/Screens/StackScreens/components/AddEditRestaurantScreen/AddEditTableActionSheet";
import AddEditLocationActionSheet from "../modules/User/Screens/StackScreens/components/AddEditRestaurantScreen/AddEditLocationActionSheet";

registerSheet("my-action-sheet", MyActionSheet);
registerSheet("add-edit-table-sheet", AddEditTableActionSheet);
registerSheet("add-edit-location-sheet", AddEditLocationActionSheet);

export {};
