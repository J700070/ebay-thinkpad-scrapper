const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


const elementsToClickSelector = '.s-item__title';

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: ['--window-size=1400,900',
            '--remote-debugging-port=9222',
            "--remote-debugging-address=0.0.0.0", // You know what your doing?
            '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true'
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    for (let i = 1; i < 50; i++) {
        await page.goto('https://www.ebay.es/sch/i.html?_from=R40&_nkw=thinkpad&_sacat=175672&_ipg=200&_pgn=' + i + '&rt=nc', {
            waitUntil: 'networkidle2',
        });


        //We dont want the first 9 elements (which are not products)
        let elementsToClick = (await page.$$(elementsToClickSelector)).slice(9);
        console.log(`Elements to click: ${elementsToClick.length}`);

        for (let j = 0; j < elementsToClick.length; j++) {
            //Click element
            elementsToClick[j].click();
            await page.waitForTimeout(4000);

            // Get data from page
            try {
                const result = await page.evaluate(() => {
                    let type = "";
                    let name = "";
                    let price = "";
                    let shippingCost = "";
                    let arrivalDate = "";
                    let state = "";
                    let numberOfVotes = "";
                    let percentageOfVotes = "";


                    //Is an Auction?
                    if (document.querySelector('#prcIsum_bidPrice') != null) {
                        //Evaluation for auction
                        type = "Auction";
                        name = document.querySelector('#itemTitle').innerText;
                        name = name.replace('Detalles de  \n', '');
                        name = name.replace('- ver título original', '');
                        price = document.querySelector('#prcIsum_bidPrice').innerText;
                        shippingCost = document.querySelector('#fshippingCost > span:nth-child(1)').innerText;
                        arrivalDate = document.querySelector('#delSummary > div:nth-child(1) > span:nth-child(1) > b:nth-child(1)').innerText;
                        state = document.querySelector('#vi-itm-cond').innerText;
                        numberOfVotes = document.querySelector('.mbg-l > a:nth-child(1)').innerText;
                        percentageOfVotes = document.querySelector('#si-fb').innerText;
                    } else {
                        //Evaluation for non-auction
                        type = "Non-Auction";
                        name = document.querySelector('#itemTitle').innerText;
                        name = name.replace('Detalles de  \n', '');
                        name = name.replace('- ver título original', '');
                        price = document.querySelector('#prcIsum').innerText;
                        shippingCost = document.querySelector('#fshippingCost > span:nth-child(1)').innerText;
                        arrivalDate = document.querySelector('#delSummary > div:nth-child(1) > span:nth-child(1) > b:nth-child(1)').innerText;
                        state = document.querySelector('#vi-itm-cond').innerText;
                        numberOfVotes = document.querySelector('.mbg-l > a:nth-child(1)').innerText;
                        percentageOfVotes = document.querySelector('#si-fb').innerText;
                    }
                    //EXPAND HERE TO EXTRACT ADDITIONAL INFO
                    //getDataFromTitle(name);
                    return { type, name, price, shippingCost, arrivalDate, state, numberOfVotes, percentageOfVotes };
                });
                console.log(result);
            } catch {
                console.log("No se ha podido coger datos.");
            }

            // We go back and get again the elements
            await page.goBack();
            elementsToClick = (await page.$$(elementsToClickSelector)).slice(9);

            await page.waitForSelector(elementsToClickSelector).then(() => /* console.log(`Elements to click: ${elementsToClick.length}`) */ { });
        }

        console.log("Página: " + i)
        console.log(pepe);
    }

    await browser.close();
};

function getDataFromTitle(name) {
    //Break name into words
    var words = name.split(" ");

    for (let i = 0; i < words.length; i++) {
        //We convert to lower case
        let word = words[i].toLocaleLowerCase()
        //Delete unnecesary data:
        //Word: "laptop"
        if (word.includes('portátil') || word.includes('portatil') || words[i].includes('laptop'))
            words[i] = '';

        //Word: "thinkpad"
        if (words[i].includes('thinkpad') || words[i].includes('think') || words[i].includes('pad'))
            words[i] = '';

        //Word: "ordenador"
        if (words[i].includes('ordenador') || words[i].includes('computer') || words[i].includes('computadora'))
            words[i] = '';

        //EXPAND HERE TO EXTRACT ADDITIONAL INFO
    }

}

run();