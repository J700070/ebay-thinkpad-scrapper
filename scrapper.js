/* 
1. Conseguir lista de todos los resultados
2. Conseguir nombre, precio, gastos de envio => estado, vostos positivos del vendedor (%), número de votos,
 specs: modelo, procesador, ssd, hdd, tamaño pantalla, ram,  



 Ciclo de vida:
    loop páginas 1-50:
        loop items 1-200:
            => Entrar al objeto => Recopilar información => Escribir en una fila de excel?


*/

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

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
                    let price = document.querySelector('#prcIsum').innerText;
                    return { price };
                });
                console.log(result);
            } catch {
                console.log("No se ha podido coger datos.")
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