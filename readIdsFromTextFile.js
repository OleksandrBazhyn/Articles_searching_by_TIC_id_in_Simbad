const fs = require("fs");

/**
 * Reads TIC IDs from a file and returns them as an array of strings.
 * @param {string} filePath - Path to the file containing TIC IDs.
 * @returns {string[]} Array of TIC IDs.
 */
function readIdsFromTextFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data.split("\n").map(line => line.trim()).filter(line => line !== "");
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return [];
    }
}

module.exports = { readIdsFromTextFile };
