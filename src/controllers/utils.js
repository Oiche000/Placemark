export function getCategoryDesign(category) {
  switch (category) {
    case "Hiking":
      return { icon: "fas fa-hiking", colour: "success" }; // Green
    case "Swimming":
      return { icon: "fas fa-swimmer", colour: "info" }; // Blue
    case "Heritage":
      return { icon: "fas fa-landmark", colour: "warning" }; // Yellow
    case "Kayaking":
      return { icon: "fas fa-water", colour: "link" }; // Dark Blue
    case "Caving":
      return { icon: "fas fa-dungeon", colour: "dark" }; // Black/Dark
    case "Stargazing":
      return { icon: "fas fa-star", colour: "black" }; // Black
    default:
      return { icon: "fas fa-map-marker-alt", colour: "primary" }; // Default Teal
  }
};