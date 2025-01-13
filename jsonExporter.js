const fs = require("fs");

/**
 * Exports multiple TICs and their links to a JSON file.
 * @param {Array} data - Array of objects containing TIC and links. Each object should have the structure: { TIC: string, links: Array }.
 * @param {string} fileName - Name of the JSON file (default is "result.json").
 */
function exportToJson(data, fileName = "result.json") {
    if (!Array.isArray(data)) {
        throw new Error("Expected an array of TIC data.");
    }

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf8");
    console.log(`Data has been saved to ${fileName}`);
}

module.exports = { exportToJson };
