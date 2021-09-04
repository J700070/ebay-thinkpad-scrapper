/* 
1. Conseguir lista de todos los resultados
2. Conseguir nombre, precio, gastos de envio, fecha de entrega, estado, vostos positivos del vendedor (%), número de votos,
 specs: modelo, procesador, ssd, hdd, tamaño pantalla, ram,  



 Ciclo de vida:
    loop páginas 1-50:
        loop items 1-200:
            => Entrar al objeto => Determianar si es puja o venta => Recopilar información => Escribir en una fila de excel?


*/

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const elementsToClickSelector = '.s-item__title';

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: ['--window-size=1400,900',
            '--remote-debugging-port=9222',
            "--remote-debugging-address=0.0.0.0", // You know what your doing?
            '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true'
        ]
    });

    const page = await browser.newPage();

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
            await page.waitForTimeout(2000);

            // Get data from page
            try {
                const result = await page.evaluate(() => {
                    //Auction?

                    //Evaluation for auction


                    //Evaluation for non-auction
                    let name = document.querySelector('#itemTitle').innerText;
                    name = name.replace('Detalles de  \n', '');
                    name = name.replace('- ver título original', '');
                    let price = document.querySelector('#prcIsum').innerText;
                    let shippingCost = document.querySelector('#fshippingCost > span:nth-child(1)').innerText;
                    let arrivalDate = document.querySelector('#delSummary > div:nth-child(1) > span:nth-child(1) > b:nth-child(1)').innerText;
                    let state = document.querySelector('#vi-itm-cond').innerText;
                    let numberOfVotes = document.querySelector('.mbg-l > a:nth-child(1)').innerText;
                    let percentageOfVotes = document.querySelector('#si-fb').innerText;

                    return { name, price, shippingCost, arrivalDate, state, numberOfVotes, percentageOfVotes };
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



        /* elements.forEach(async (element) => {
            if (element != undefined) {
                await element.click().then();
                await page.evaluate(() => {
                    return document.querySelector('#prcIsum').textContent;
                }).then(page.goBack());
            }
     
        }); */

        /* if (element !== undefined) {
            try {
                await element.click();
                let test = await page.$('#prcIsum')
                console.log(test);
                // Get the data you want here and push it into the data array
                await page.goBack();
            } catch {
                console.log("No se ha podido obtener información.")
            }
        } */



        /* let list = await page.evaluate(() => {
            let elementNames = document.getElementsByClassName('s-item__title');
     
            let names = [];
     
            for (j = 0; j < elementNames.length; j++) {
                if ((elementNames[j].innerText) != '') {
                    elementNames[j].click();
     
     
     
     
     
                }
                  names[j] = (elementNames[j].innerText); 
            }
            return names;
        }); */


        console.log("Página: " + i)
        console.log(pepe);
    }



    await browser.close();
};
run();