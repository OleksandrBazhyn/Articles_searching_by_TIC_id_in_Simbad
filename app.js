const { Builder, By, error } = require("selenium-webdriver");

const testTIC = "TIC 103509957";

function buildLink(TIC_string) {
    // Перевірка типу параметра
    if (typeof TIC_string !== 'string') {
        throw new Error('buildLink: TIC_string has wrong type. Expected a string.');
    }
    
    // Основна URL-частина
    const basicLink = "https://simbad.u-strasbg.fr/simbad/sim-basic?submit=SIMBAD+search&Ident=";

    // Заміна пробілу на "+" у переданому рядку
    const transformedTIC = TIC_string.replace(" ", "+");

    // Формування повного посилання
    return basicLink + transformedTIC;
}

const link = buildLink(testTIC);

async function findArticles(link) {
    //launch the browser
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(link);

        let button = await driver.findElement(By.css("input[value='Display']"));

        await button.click();

        const articleLinks = await driver.findElements(By.xpath('//a[contains(@href, "simbad/sim-ref?bibcode")]'));

        // Перевіряємо, чи є посилання
        if (articleLinks.length === 0) {
            console.log('Жодного посилання на статтю не знайдено.');
            return;
        }

        console.log(`Знайдено ${articleLinks.length} статей.`);

        // Натискаємо на всі знайдені посилання або обробляємо їх
        for (const [index, link] of articleLinks.entries()) {
            const text = await link.getText(); // Отримати текст посилання
            console.log(`Стаття ${index + 1}: ${text}`);
            
            // Якщо потрібно натиснути:
            // await link.click();
            // break; // Якщо треба натиснути лише перше
        }
    } catch (error) {
        console.error(error);
    }
}

findArticles(link);