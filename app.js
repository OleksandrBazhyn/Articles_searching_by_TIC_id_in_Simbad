const { Builder, By } = require("selenium-webdriver");

const testTIC = "TIC 420111264";

function buildLink(TIC_string) {
    if (typeof TIC_string !== "string") {
        throw new Error("buildLink: TIC_string has wrong type. Expected a string.");
    }

    const basicLink = "https://simbad.u-strasbg.fr/simbad/sim-basic?submit=SIMBAD+search&Ident=";
    const transformedTIC = TIC_string.replace(" ", "+");
    return basicLink + transformedTIC;
}

const link = buildLink(testTIC);

async function findArticles(link) {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(link);

        let button = await driver.findElement(By.css("input[value='Display']"));
        await button.click();

        const articleLinks = await driver.findElements(By.xpath('//a[contains(@href, "simbad/sim-ref?bibcode")]'));

        if (articleLinks.length === 0) {
            console.log("No link to the article was found.");
            return;
        }


        const filteredLinks = [];

        for (let i = articleLinks.length - 1; i > 0; i -= 2) {
            const currentLink = articleLinks[i];
            const previousLink = articleLinks[i - 1];

            const currentText = await currentLink.getText();
            const currentHref = await currentLink.getAttribute("href");

            const previousText = await previousLink.getText();
            const previousHref = await previousLink.getAttribute("href");

            if (/^\d+$/.test(currentText)) {
                if (previousText.trim() !== "") {
                    filteredLinks.push({
                        articleText: previousText,
                        articleHref: previousHref,
                    });
                }
            }
        }
        filteredLinks.reverse();

        console.log(`Found ${filteredLinks.length} articles.`);
        
        filteredLinks.forEach((pair, index) => {
            console.log(
                `Article ${index + 1}: ${pair.articleText} (${pair.articleHref})\n`
            );
        });

    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
    }
}

findArticles(link);
