const { chromium } = require("playwright");

async function sleep(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    // open browser tab
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        locale: "en-GB",
    });
    const page = await context.newPage();
    await sleep(2000);

    // open url
    await page.goto("https://google.com");
    await sleep(2000);
    await page.getByRole("button", { name: "Reject all" }).click();
    await sleep(2000);
    await page.getByRole("combobox", { name: "Search" }).fill("What is a wombat?");
    await sleep(2000);
    await page.getByRole("combobox", { name: "Search" }).press("Enter");
    await sleep(2000);
    // get all search result from page 1
    const resultLocators = await page
        .locator("#search")
        .locator("#rso")
        .locator("div.K7khPe")
        .all();
    console.log("result count:", resultLocators.length);
    const results = [];
    for (let result of resultLocators) {
        // read title and link
        const title = await result.getByRole("heading").innerText();
        const link = await result.getByRole("link").first().getAttribute("href");
        results.push({ title, link });
    }
    // output all links
    console.log(results);

    // wait and close browser
    await sleep(10000);
    await browser.close();
})()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
