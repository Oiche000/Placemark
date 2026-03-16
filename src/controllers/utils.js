export function getCategoryDesign(category) {
  switch (category) {
    case "Hiking":
      return { icon: "fas fa-hiking", color: "is-success" }; // Green
    case "Swimming":
      return { icon: "fas fa-swimmer", color: "is-info" }; // Blue
    case "Heritage":
      return { icon: "fas fa-landmark", color: "is-warning" }; // Yellow
    case "Kayaking":
      return { icon: "fas fa-water", color: "is-link" }; // Dark Blue
    case "Caving":
      return { icon: "fas fa-dungeon", color: "is-dark" }; // Black/Dark
    case "Stargazing":
      return { icon: "fas fa-star", color: "is-black" }; // Black
    default:
      return { icon: "fas fa-map-marker-alt", color: "is-primary" }; // Default Teal
  }
};