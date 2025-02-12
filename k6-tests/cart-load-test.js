import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem, randomIntBetween, uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const products = [
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

export const options = {
    vus: 6, 
    duration: '10m', 
};

export default function () {
    let user = uuidv4(); 
    let product = randomItem(products); 

    
    let res = http.get(`http://localhost:30007/api/products/${product}`);
    check(res, {
        'GET product details status is 200': (r) => r.status === 200,
    });

    let cartItem = {
        item: {
            productId: product,
            quantity: randomIntBetween(1, 10), 
        },
        userId: user,
    };

    res = http.post('http://localhost:30007/api/cart', JSON.stringify(cartItem), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'POST add to cart status is 200': (r) => r.status === 200,
    });
    sleep(0.2)
}