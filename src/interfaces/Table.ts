export default class Table {
  uid?: string;
  capacity: number;
  tableName: string;
  location: TableLocationType;
  type: TableTypeType;
  status: TableStatusType;
  constructor(
    uid: string,
    capacity: number,
    tableName: string,
    location: TableLocationType,
    type: TableTypeType,
    status: TableStatusType
  ) {
    if (uid) this.uid = uid;
    this.capacity = capacity;
    this.tableName = tableName;
    this.location = location;
    this.type = type;
    this.status = status;
  }
}
export const TABLE_STATUS = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  OCCUPIED: "Occupied",
};

export const TABLE_TYPE = {
  STANDARD_DINING: "Standard Dining Table",
  BOOTH: "Booth",
  HIGH_TOP: "High-Top Table",
  COUNTER_OR_BAR: "Counter or Bar Seating",
  COMMUNAL_OR_SHARED: "Communal or Shared Table",
  OUTDOOR_PATIO: "Outdoor Patio Table",
  CAFE: "Café Table",
  PICNIC: "Picnic Table",
  ROUND: "Round Table",
  SQUARE: "Square Table",
  RECTANGULAR: "Rectangular Table",
  CORNER: "Corner Table",
  WINDOW_SIDE: "Window-Side Table",
  CHEFS: "Chef's Table",
  SUSHI_BAR: "Sushi Bar Seating",
  PRIVATE_DINING: "Private Dining Room Table",
  OUTDOOR_LOUNGE: "Outdoor Lounge Seating",
  POOLSIDE: "Poolside Table",
  LIBRARY_OR_STUDY: "Library or Study Table",
  STAGE_FRONT: "Stage-Front Table",
  VIP: "VIP Table",
  FIREPLACE: "Fireplace Table",
  GAZEBO_OR_PAVILION: "Gazebo or Pavilion Table",
  KIDS: "Kids' Table",
  CONFERENCE_OR_MEETING: "Conference or Meeting Table",
};

export const TABLE_LOCATION = {
  INDOOR_DINING_ROOM: "Indoor Dining Room",
  OUTDOOR_PATIO: "Outdoor Patio",
  OUTDOOR_TERRACE: "Outdoor Terrace",
  BAR_AREA: "Bar Area",
  PRIVATE_DINING_ROOM: "Private Dining Room",
  BOOTH: "Booth",
  HIGH_TOP_TABLE: "High-Top Table",
  WINDOW_SEATS: "Window Seats",
  BANQUETTE_SEATING: "Banquette Seating",
  COUNTER_OR_SUSHI_BAR: "Counter or Sushi Bar",
  LOUNGE_AREA: "Lounge Area",
  CHEFS_TABLE: "Chef's Table",
  LIBRARY_OR_STUDY_AREA: "Library or Study Area",
  GARDEN: "Garden",
  ROOFTOP_TERRACE: "Rooftop Terrace",
  WATERFRONT: "Waterfront",
  BEACHFRONT: "Beachfront",
  POOLSIDE: "Poolside",
  VIP: "VIP",
  FIREPLACE: "Fireplace",
};

export type TableTypeType = (typeof TABLE_TYPE)[keyof typeof TABLE_TYPE];
export type TableStatusType = (typeof TABLE_STATUS)[keyof typeof TABLE_STATUS];
export type TableLocationType =
  (typeof TABLE_LOCATION)[keyof typeof TABLE_LOCATION];
