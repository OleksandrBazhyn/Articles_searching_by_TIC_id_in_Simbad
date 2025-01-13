const { buildLink } = require("./linkBuilder");
const { findArticles } = require("./articleScraper");
const { exportToJson } = require("./jsonExporter");
const { readTicIdsFromFile } = require("./readTicIdsFromFile");

const testTIC = "TIC 420111264";

const inputTICs = readTicIdsFromFile("stars.txt");

(async () => {
    const link = buildLink(testTIC);
    const articles = await findArticles(link);

    if (articles.length > 0) {
        console.log(`Found ${articles.length} articles:`);
        articles.forEach((article, index) => {
            console.log(`Article ${index + 1}: ${article.articleText} (${article.articleHref})`);
        });

        const ticData = {
            TIC: testTIC,
            links: articles.map(article => article.articleHref),
        };

        exportToJson(ticData);
    } else {
        console.error("No articles found for the given TIC.");

        const ticData = {
            TIC: testTIC,
            links: ["No data"],
        };

        exportToJson(ticData);
    }
})();
