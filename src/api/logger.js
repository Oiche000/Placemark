export function validationError(request, h, error) {
  console.log(error.message, "🚨 JOI VALIDATION ERROR 🚨:", error.details[0].message);
  return error;
}
