function buildLink(TIC_string) {
    if (typeof TIC_string !== "string") {
        throw new Error("buildLink: TIC_string has wrong type. Expected a string.");
    }

    const basicLink = "https://simbad.u-strasbg.fr/simbad/sim-basic?submit=SIMBAD+search&Ident=";
    const transformedTIC = TIC_string.replace(" ", "+");
    return basicLink + transformedTIC;
}

module.exports = { buildLink };