import { defineMcp } from "@lovable.dev/mcp-js";
import listRooms from "./tools/list-rooms";
import listDestinations from "./tools/list-destinations";
import getDestination from "./tools/get-destination";
import listTourPackages from "./tools/list-tour-packages";
import getTourPackage from "./tools/get-tour-package";
import getBistroMenu from "./tools/get-bistro-menu";
import getHostelInfo from "./tools/get-hostel-info";

export default defineMcp({
  name: "xtsy-mcp",
  title: "XTSY Travel & Hostel",
  version: "0.1.0",
  instructions:
    "Read-only tools for XTSY (Shillong, Meghalaya). Use `list_rooms` for hostel/dorm/luxury stays and prices, `list_destinations` and `get_destination` for Meghalaya travel spots, `list_tour_packages` and `get_tour_package` for Northeast India tours, `get_bistro_menu` for the TAB Bistro menu, and `get_hostel_info` for brand, awards and booking links. All prices are in INR and bookings go through https://xtsy.one/book.",
  tools: [
    listRooms,
    listDestinations,
    getDestination,
    listTourPackages,
    getTourPackage,
    getBistroMenu,
    getHostelInfo,
  ],
});
