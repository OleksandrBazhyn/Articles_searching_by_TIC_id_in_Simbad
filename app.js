const { buildLink } = require("./linkBuilder");
const { findArticles } = require("./articleScraper");
const { exportToJson } = require("./jsonExporter");

const testTIC = "TIC 420111264";

(async () => {
    const link = buildLink(testTIC);
    const articles = await findArticles(link);

    if (articles.length > 0) {
        console.log(`Found ${articles.length} articles:`);
        articles.forEach((article, index) => {
            console.log(`Article ${index + 1}: ${article.articleText} (${article.articleHref})`);
        });
    } else {
        console.log("No articles found for the given TIC.");
    }
})();
