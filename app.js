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