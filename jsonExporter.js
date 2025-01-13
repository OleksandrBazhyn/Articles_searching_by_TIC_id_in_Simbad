const fs = require("fs");

/**
 * Exports data to a JSON file.
 * @param {object|array} data - Data to export (can be an object or an array).
 * @param {string} fileName - Name of the JSON file (default is "result.json").
 */
function exportToJson(data, fileName = "result.json") {
    if (typeof data !== "object" || data === null) {
        throw new Error("Expected an object or an array for export.");
    }

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf8");
    console.log(`Data has been saved to ${fileName}`);
}

module.exports = { exportToJson };
