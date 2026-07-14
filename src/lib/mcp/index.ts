import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listRooms from "./tools/list-rooms";
import listDestinations from "./tools/list-destinations";
import getDestination from "./tools/get-destination";
import listTourPackages from "./tools/list-tour-packages";
import getTourPackage from "./tools/get-tour-package";
import getBistroMenu from "./tools/get-bistro-menu";
import getHostelInfo from "./tools/get-hostel-info";

// The OAuth issuer MUST be the direct Supabase host, built from the project ref
// (Vite inlines this literal at build time, keeping the entry import-safe). The
// fallback keeps the issuer well-formed during the manifest-extract eval.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "xtsy-mcp",
  title: "XTSY Travel & Hostel",
  version: "0.1.0",
  instructions:
    "Read-only tools for XTSY (Shillong, Meghalaya). Use `list_rooms` for hostel/dorm/luxury stays and prices, `list_destinations` and `get_destination` for Meghalaya travel spots, `list_tour_packages` and `get_tour_package` for Northeast India tours, `get_bistro_menu` for the TAB Bistro menu, and `get_hostel_info` for brand, awards and booking links. All prices are in INR and bookings go through https://xtsy.one/book.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
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
