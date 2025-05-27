function sanitizeInput(input: string) {
  if (typeof input !== "string") return input;

  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/--/g, "") // Remove SQL comment symbols
    .replace(/;/g, "") // Remove semicolons
    .replace(/\/\*/g, "") // Remove /*
    .replace(/\*\//g, "") // Remove */
    .replace(/xp_/gi, ""); // Avoid some SQL Server procedures
}
export default sanitizeInput;
