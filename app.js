const { buildLink } = require("./linkBuilder");
const { findArticles } = require("./articleScraper");
const { exportToJson } = require("./jsonExporter");
const { readIdsFromTextFile } = require("./readIdsFromTextFile");

const inputTICs = readIdsFromTextFile("stars.txt");

(async () => {
    console.log(`Processing ${inputTICs.length} TIC IDs...`);

    try {
        const results = await Promise.all(
            inputTICs.map(async (tic) => {
                console.log(`Processing TIC: ${tic}`);
                const link = buildLink(tic);
                const articles = await findArticles(link);

                if (articles.length > 0) {
                    console.log(`Found ${articles.length} articles for ${tic}`);
                } else {
                    console.log(`No articles found for ${tic}`);
                }

                return {
                    TIC: tic,
                    links: articles.length > 0 
                        ? articles.map(article => article.articleHref)
                        : ["No data"],
                };
            })
        );

        // Збереження результатів у JSON
        exportToJson(results, "results.json");
        console.log("All data has been collected and saved.");
    } catch (error) {
        console.error("Error during processing:", error);
    }
})();
