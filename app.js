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
            console.log("Жодного посилання на статтю не знайдено.");
            return;
        }

        // console.log(`Знайдено ${articleLinks.length} посилань.`);

        // Масив для збереження відфільтрованих пар
        const filteredPairs = [];

        // Ідемо з кінця масиву попарно
        for (let i = articleLinks.length - 1; i > 0; i -= 2) {
            const currentLink = articleLinks[i];
            const previousLink = articleLinks[i - 1];

            // Отримуємо текст і посилання для обох
            const currentText = await currentLink.getText();
            const currentHref = await currentLink.getAttribute("href");

            const previousText = await previousLink.getText();
            const previousHref = await previousLink.getAttribute("href");

            // Перевіряємо, чи поточне посилання є набором цифр
            if (/^\d+$/.test(currentText)) {
                // Перевіряємо, чи попереднє посилання виглядає як назва статті
                if (previousText.trim() !== "") {
                    // Додаємо пару в масив
                    filteredPairs.push({
                        articleText: previousText,
                        articleHref: previousHref,
                        numberText: currentText,
                        numberHref: currentHref,
                    });
                }
            }
        }

        // Виводимо відфільтровані пари
        console.log(`Знайдено ${filteredPairs.length} пар.`);
        filteredPairs.reverse();
        filteredPairs.forEach((pair, index) => {
            console.log(
                `Пара ${index + 1}:\n` +
                `  Стаття: ${pair.articleText} (${pair.articleHref})\n` +
                `  Номер: ${pair.numberText} (${pair.numberHref})`
            );
        });

    } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
    }
}

findArticles(link);
