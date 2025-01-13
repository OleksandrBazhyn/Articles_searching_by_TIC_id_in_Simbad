import { buildLink } from "./linkBuilder.js";
import { findArticles } from "./articleScraper.js";
import { exportToJson } from "./jsonExporter.js";
import { readIdsFromTextFile } from "./readIdsFromTextFile.js";
import pLimit from "p-limit";

const MAX_CONCURRENT_REQUESTS = 4; // Максимальна кількість паралельних запитів
const inputTICs = readIdsFromTextFile("stars.txt");

(async () => {
    console.log(`Processing ${inputTICs.length} TIC IDs...`);

    const limit = pLimit(MAX_CONCURRENT_REQUESTS);

    try {
        const results = await Promise.all(
            inputTICs.map((tic) =>
                limit(async () => {
                    try {
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
                                ? articles.map((article) => article.articleHref)
                                : ["No data"],
                        };
                    } catch (error) {
                        console.error(`Error processing TIC ${tic}:`, error);
                        return { TIC: tic, links: ["Error"] };
                    }
                })
            )
        );

        exportToJson(results, "results.json");
        console.log("All data has been collected and saved.");
    } catch (error) {
        console.error("Global error during processing:", error);
    }
})();