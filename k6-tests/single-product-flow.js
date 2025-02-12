import { browser } from 'k6/browser'
import { check } from 'k6'
import { sleep } from 'k6'
import { fail } from 'k6'
import exec from 'k6/execution';
import { url } from 'k6/http';

export const options = {
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 1,
      duration: '15m',

      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
}

export const products = [
  "0PUK6V6EV0",
  "1YMWWN1N4O",
  "2ZYFJ3GM2N",
  "66VCHSJNUP",
  "6E92ZMYYFZ",
  "9SIQT8TOJO",
  "L9ECAV7KIM",
  "LS4PSXUNUM",
  "OLJCESPC7Z",
  "HQTGWGPNH4",
];

const countries = [
  "United States",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Sweden",
  "Norway",
  "Greece",
  "Hungary",
  "Poland"
];

export default async function () {
  const page = await browser.newPage()
  let rndProducts = Math.floor(Math.random() * products.length)
  let selector = 'a[href="/product/' + products[rndProducts] + '"]'

  try {
    await page.goto('http://localhost:30007')

    console.log("Trying to visit product: ", selector)

    const productButton = page.locator(selector)
    await Promise.all([page.waitForNavigation(), productButton.click()])
    console.log("Adding product to cart...")
    const addToCartButton = page.locator('button[data-cy="product-add-to-cart"]')
    await Promise.all([page.waitForNavigation({timeout: 1500}), addToCartButton.click()]).catch((error) => {
      fail("Error on adding item to cart")
    });
    console.log("Placing order...")
    const countryInput = page.locator('input[name="country"')
    await countryInput.clear()
    let rndCountry = Math.floor(Math.random() * countries.length)
    await countryInput.fill(countries[rndCountry])
    const placeOrderButton = page.locator('button[data-cy="checkout-place-order"]')
    await Promise.all([page.waitForNavigation({timeout: 1000}), placeOrderButton.click()]).catch((error) => {
      fail("Error placing order")
    });
    console.log("Order placed...")
  } finally {
    await page.close()
  }
}
