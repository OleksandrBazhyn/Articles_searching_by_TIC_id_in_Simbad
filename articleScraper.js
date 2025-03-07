const { Builder, By } = require("selenium-webdriver");

async function findArticles(link) {
    let driver = await new Builder().forBrowser("chrome").build();
    const filteredLinks = [];

    try {
        await driver.get(link);

        let button = await driver.findElement(By.css("input[value='Display']"));
        await button.click();

        const articleLinks = await driver.findElements(By.xpath('//a[contains(@href, "simbad/sim-ref?bibcode")]'));

        if (articleLinks.length === 0) {
            console.log("No link to the article was found.");
            return filteredLinks;
        }

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

    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
    }

    return filteredLinks;
}

module.exports = { findArticles };
