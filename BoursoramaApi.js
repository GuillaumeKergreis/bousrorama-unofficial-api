'use strict';

const puppeteer = require('puppeteer');
const Util = require('./Util');

/**
 * Class representing the Boursorama API
 */
class BoursoramaApi {

    PASSWORD_DIGITS_IMAGES = {
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0yMS41IDZjNC42IDAgNi40IDQuOCA2LjQgOC45cy0xLjggOC45LTYuNCA4LjljLTQuNyAwLTYuNC00LjgtNi40LTguOXMxLjgtOC45IDYuNC04Ljl6bTAgMS40Yy0zLjYgMC00LjggNC00LjggNy42IDAgMy41IDEuMiA3LjYgNC44IDcuNnM0LjgtNCA0LjgtNy42LTEuMi03LjYtNC44LTcuNnoiIGZpbGw9IiMwMDM4ODMiLz48L3N2Zz4=': '0',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0yMC44IDguMy0yLjggMy0uOS0xIDMuOC00aDEuM3YxNy4zaC0xLjV2LTE1LjN6IiBmaWxsPSIjMDAzODgzIi8+PC9zdmc+': '1',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMy45IDM1LjloLTMuNmwtLjYgMS42aC0xbDIuOS03LjJoMS4xbDIuOSA3LjJoLTF6bS0zLjMtLjhoM2wtMS41LTMuOXoiLz48cGF0aCBkPSJtMTguNyAzMC4zaDMuMmMxLjIgMCAyIC44IDIgMS44IDAgLjktLjYgMS41LTEuMyAxLjYuOC4xIDEuNC45IDEuNCAxLjggMCAxLjItLjggMS45LTIuMSAxLjloLTMuM3YtNy4xem0zIDMuMWMuOCAwIDEuMi0uNSAxLjItMS4yIDAtLjYtLjQtMS4yLTEuMi0xLjJoLTIuMnYyLjNoMi4yem0wIDMuM2MuOCAwIDEuMy0uNSAxLjMtMS4ycy0uNS0xLjItMS4zLTEuMmgtMi4ydjIuNWgyLjJ6Ii8+PHBhdGggZD0ibTI3LjMgMzMuOWMwLTIuMiAxLjYtMy43IDMuNy0zLjcgMS4zIDAgMi4yLjYgMi43IDEuNGwtLjguNGMtLjQtLjYtMS4yLTEtMi0xLTEuNiAwLTIuOCAxLjItMi44IDIuOXMxLjIgMi45IDIuOCAyLjljLjggMCAxLjYtLjQgMi0xbC44LjRjLS42LjgtMS41IDEuNC0yLjcgMS40LTIuMSAwLTMuNy0xLjUtMy43LTMuN3oiLz48L2c+PHBhdGggZD0ibTE1LjkgMjIuM2M1LjktNC43IDkuOC04LjEgOS44LTExLjQgMC0yLjUtMi0zLjUtMy45LTMuNS0yLjEgMC0zLjguOS00LjcgMi4zbC0xLS45YzEuMi0xLjggMy4zLTIuOCA1LjctMi44IDIuNSAwIDUuNCAxLjQgNS40IDQuOSAwIDMuOC00IDcuMy05IDExLjNoOS4xdjEuM2gtMTEuNHoiLz48L2c+PC9zdmc+': '2',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMC4yIDMwLjNoMi41YzIuMiAwIDMuNyAxLjYgMy43IDMuNnMtMS41IDMuNi0zLjcgMy42aC0yLjV6bTIuNSA2LjRjMS43IDAgMi44LTEuMiAyLjgtMi44IDAtMS41LTEtMi44LTIuOC0yLjhoLTEuNnY1LjZ6Ii8+PHBhdGggZD0ibTE5LjkgMzAuM2g0Ljd2LjhoLTMuOHYyLjNoMy43di44aC0zLjd2Mi41aDMuOHYuOGgtNC43eiIvPjxwYXRoIGQ9Im0yOC4xIDMwLjNoNC43di44aC0zLjh2Mi4zaDMuN3YuOGgtMy43djMuM2gtLjl6Ii8+PC9nPjxwYXRoIGQ9Im0xNi4zIDIwLjFjMSAxLjQgMi42IDIuNCA0LjggMi40IDIuNyAwIDQuMy0xLjQgNC4zLTMuNyAwLTIuNS0yLTMuNS00LjYtMy41LS43IDAtMS4zIDAtMS42IDB2LTEuM2gxLjZjMi4zIDAgNC40LTEgNC40LTMuMyAwLTIuMS0xLjktMy4zLTQuMS0zLjMtMiAwLTMuNC44LTQuNiAyLjJsLS45LS45YzEuMi0xLjUgMy4xLTIuNyA1LjYtMi43IDMgMCA1LjYgMS42IDUuNiA0LjYgMCAyLjYtMi4yIDMuOC0zLjcgNCAxLjUuMiA0IDEuNCA0IDQuM3MtMi4xIDQuOS01LjggNC45Yy0yLjggMC00LjktMS4zLTUuOS0yLjl6Ii8+PC9nPjwvc3ZnPg==': '3',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMy42IDMwLjJjMS4zIDAgMi4yLjYgMi44IDEuM2wtLjcuNWMtLjUtLjYtMS4yLTEtMi4xLTEtMS42IDAtMi44IDEuMi0yLjggMi45czEuMiAyLjkgMi44IDIuOWMuOSAwIDEuNi0uNCAxLjktLjh2LTEuNWgtMi41di0uOGgzLjR2Mi42Yy0uNy43LTEuNiAxLjItMi44IDEuMi0yIDAtMy43LTEuNS0zLjctMy43czEuNy0zLjYgMy43LTMuNnoiLz48cGF0aCBkPSJtMjUuMSAzNC4yaC00LjJ2My4zaC0uOXYtNy4yaC45djMuMWg0LjJ2LTMuMWguOXY3LjJoLS45eiIvPjxwYXRoIGQ9Im0yOS44IDMwLjNoLjl2Ny4yaC0uOXoiLz48L2c+PHBhdGggZD0ibTIzLjYgMTguOGgtOC4ydi0xLjNsNy43LTExLjJoMnYxMS4yaDIuNXYxLjNoLTIuNXY0LjdoLTEuNXptLTYuNy0xLjNoNi43di05Ljd6Ii8+PC9nPjwvc3ZnPg==': '4',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMS42IDM2LjFjLjMuNC43LjcgMS40LjcuOSAwIDEuNC0uNiAxLjQtMS41di01aC45djVjMCAxLjYtMSAyLjMtMi4zIDIuMy0uOCAwLTEuNC0uMi0xLjktLjh6Ii8+PHBhdGggZD0ibTIwLjcgMzQuMy0uNy44djIuNGgtLjl2LTcuMmguOXYzLjdsMy4yLTMuN2gxLjFsLTMgMy40IDMuMiAzLjhoLTEuMXoiLz48cGF0aCBkPSJtMjcuNyAzMC4zaC45djYuNGgzLjR2LjhoLTQuMnYtNy4yeiIvPjwvZz48cGF0aCBkPSJtMTcuNCAyMC4xYzEuMSAxLjYgMi42IDIuNSA0LjggMi41IDIuNSAwIDQuMy0xLjggNC4zLTQuMiAwLTIuNi0xLjgtNC4yLTQuMy00LjItMS42IDAtMi45LjUtNC4yIDEuN2wtMS0uNnYtOWgxMHYxLjNoLTguNXY2LjhjLjktLjggMi4zLTEuNiA0LjEtMS42IDIuOSAwIDUuNSAxLjkgNS41IDUuNSAwIDMuNC0yLjYgNS42LTUuOCA1LjYtMi45IDAtNC42LTEuMS01LjgtMi44eiIvPjwvZz48L3N2Zz4=': '5',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMy45IDMxLjYtMi40IDUuOWgtLjRsLTIuNC01Ljl2NS45aC0uOXYtNy4yaDEuM2wyLjIgNS40IDIuMi01LjRoMS4zdjcuMmgtLjl6Ii8+PHBhdGggZD0ibTE5LjUgMzEuOHY1LjdoLS45di03LjJoLjlsNC4xIDUuNnYtNS42aC45djcuMmgtLjl6Ii8+PHBhdGggZD0ibTMxLjcgMzAuMmMyLjEgMCAzLjYgMS42IDMuNiAzLjdzLTEuNCAzLjctMy42IDMuN2MtMi4xIDAtMy42LTEuNi0zLjYtMy43czEuNC0zLjcgMy42LTMuN3ptMCAuOGMtMS43IDAtMi43IDEuMi0yLjcgMi45czEgMi45IDIuNiAyLjkgMi42LTEuMiAyLjYtMi45Yy4xLTEuNy0uOS0yLjktMi41LTIuOXoiLz48L2c+PHBhdGggZD0ibTIyLjYgNmMyLjMgMCAzLjYuOSA0LjcgMi4ybC0uOSAxLjFjLS44LTEuMS0xLjktMS45LTMuOC0xLjktMy43IDAtNS4xIDMuOS01LjEgNy42di44Yy43LTEuMiAyLjctMi45IDUtMi45IDMuMSAwIDUuNiAxLjggNS42IDUuNSAwIDIuOC0yLjEgNS41LTUuOCA1LjUtNC43IDAtNi4zLTQuMy02LjMtOC45IDAtNC41IDEuOC05IDYuNi05em0tLjMgOC4yYy0xLjkgMC0zLjcgMS4yLTQuNyAzIC4yIDIuNCAxLjQgNS40IDQuNyA1LjQgMyAwIDQuMy0yLjMgNC4zLTQuMSAwLTIuOS0xLjgtNC4zLTQuMy00LjN6Ii8+PC9nPjwvc3ZnPg==': '6',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im01IDMwLjRoMi45YzEuNCAwIDIuMiAxIDIuMiAyLjJzLS44IDIuMi0yLjIgMi4yaC0ydjIuOWgtLjl6bTIuOC44aC0xLjl2Mi44aDEuOWMuOSAwIDEuNC0uNiAxLjQtMS40cy0uNS0xLjQtMS40LTEuNHoiLz48cGF0aCBkPSJtMTkuMyAzNi43LjcuNy0uNi41LS43LS43Yy0uNS4zLTEuMi41LTEuOS41LTIuMSAwLTMuNi0xLjYtMy42LTMuN3MxLjQtMy43IDMuNi0zLjdjMi4xIDAgMy42IDEuNiAzLjYgMy43LS4xIDEuMS0uNCAyLTEuMSAyLjd6bS0xLjItLjEtMS0xLjEuNi0uNSAxIDEuMWMuNC0uNS43LTEuMi43LTIgMC0xLjctMS0yLjktMi42LTIuOXMtMi42IDEuMi0yLjYgMi45IDEgMi45IDIuNiAyLjljLjUtLjEuOS0uMiAxLjMtLjR6Ii8+PHBhdGggZD0ibTI2LjIgMzQuOGgtMS40djIuOWgtLjl2LTcuMmgyLjljMS4zIDAgMi4yLjggMi4yIDIuMiAwIDEuMy0uOSAyLTEuOSAyLjFsMS45IDIuOWgtMXptLjQtMy42aC0xLjl2Mi44aDEuOWMuOCAwIDEuNC0uNiAxLjQtMS40LjEtLjgtLjUtMS40LTEuNC0xLjR6Ii8+PHBhdGggZD0ibTMyLjcgMzUuOWMuNS41IDEuMiAxIDIuMyAxIDEuMyAwIDEuNy0uNyAxLjctMS4yIDAtLjktLjktMS4xLTEuOC0xLjQtMS4yLS4zLTIuNC0uNi0yLjQtMiAwLTEuMiAxLjEtMiAyLjUtMiAxLjEgMCAxLjkuNCAyLjUgMWwtLjcuN2MtLjUtLjYtMS4zLS45LTIuMS0uOS0uOSAwLTEuNS41LTEuNSAxLjEgMCAuNy44LjkgMS43IDEuMiAxLjIuMyAyLjUuNyAyLjUgMi4yIDAgMS0uNyAyLjEtMi42IDIuMS0xLjIgMC0yLjItLjUtMi44LTEuMXoiLz48L2c+PHBhdGggZD0ibTI0LjkgNy42aC05LjV2LTEuM2gxMS4zdjFsLTcuNCAxNi4yaC0xLjZ6Ii8+PC9nPjwvc3ZnPg==': '7',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im0xMS44IDMxLjFoLTIuM3YtLjhoNS40di44aC0yLjN2Ni40aC0uOXYtNi40eiIvPjxwYXRoIGQ9Im0xOC4zIDMwLjNoLjl2NC40YzAgMS4zLjcgMi4xIDIgMi4xczItLjggMi0yLjF2LTQuNGguOXY0LjRjMCAxLjgtMSAyLjktMi45IDIuOXMtMi45LTEuMi0yLjktMi45eiIvPjxwYXRoIGQ9Im0yNy4yIDMwLjNoMWwyLjQgNi4yIDIuNC02LjJoMWwtMi45IDcuMmgtMS4xeiIvPjwvZz48cGF0aCBkPSJtMjAuMyAxNC43Yy0yLS41LTQtMS45LTQtNC4yIDAtMy4xIDIuOC00LjUgNS42LTQuNSAyLjcgMCA1LjYgMS40IDUuNiA0LjUgMCAyLjMtMiAzLjYtNCA0LjIgMi4yLjYgNC4zIDIuMiA0LjMgNC42IDAgMi44LTIuNSA0LjYtNS44IDQuNnMtNS45LTEuOC01LjktNC42Yy0uMS0yLjUgMi00LjEgNC4yLTQuNnptMS42LjZjLTEuMS4xLTQuNCAxLjItNC40IDMuOCAwIDIuMSAyLjEgMy40IDQuNCAzLjRzNC40LTEuMyA0LjQtMy40YzAtMi42LTMuNC0zLjYtNC40LTMuOHptMC03LjljLTIuMyAwLTQuMSAxLjItNC4xIDMuMyAwIDIuNCAzLjEgMy4yIDQuMSAzLjQgMS4xLS4yIDQuMS0xIDQuMS0zLjQgMC0yLjEtMS44LTMuMy00LjEtMy4zeiIvPjwvZz48L3N2Zz4=': '8',
        'data:image/svg+xml;base64, PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MiA0MiIgdmlld0JveD0iMCAwIDQyIDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDM4ODMiPjxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXciPjxwYXRoIGQ9Im03LjYgMzEuNy0xLjYgNS44aC0xbC0yLTcuMmgxbDEuNiA2IDEuNi02aC44bDEuNiA2IDEuNi02aDFsLTIgNy4yaC0xeiIvPjxwYXRoIGQ9Im0xOCAzNC40LTIuMyAzLjFoLTEuMWwyLjgtMy43LTIuNi0zLjVoMS4xbDIuMSAyLjkgMi4xLTIuOWgxLjFsLTIuNiAzLjUgMi44IDMuN2gtMS4xeiIvPjxwYXRoIGQ9Im0yNi42IDM0LjUtMi44LTQuMWgxbDIuMiAzLjMgMi4yLTMuM2gxbC0yLjggNC4xdjNoLS45di0zeiIvPjxwYXRoIGQ9Im0zMy4xIDM2LjggNC01LjZoLTR2LS44aDUuMnYuN2wtNCA1LjZoNC4xdi44aC01LjJ2LS43eiIvPjwvZz48cGF0aCBkPSJtMTcuNyAyMC42Yy44IDEuMSAxLjkgMS45IDMuOCAxLjkgMy44IDAgNS4xLTQgNS4xLTcuNnYtLjhjLS44IDEuMi0yLjcgMi45LTUuMSAyLjktMy4xIDAtNS42LTEuOC01LjYtNS41LjEtMi44IDIuMi01LjUgNS45LTUuNSA0LjcgMCA2LjMgNC4zIDYuMyA4LjkgMCA0LjQtMS44IDguOS02LjYgOC45LTIuMyAwLTMuNi0uOS00LjYtMi4yem00LjEtMTMuMmMtMyAwLTQuMyAyLjMtNC4zIDQuMSAwIDIuOCAxLjkgNC4yIDQuMyA0LjIgMS45IDAgMy43LTEuMiA0LjctMy0uMi0yLjMtMS40LTUuMy00LjctNS4zeiIvPjwvZz48L3N2Zz4=': '9',
    };

    /**
     * Create a new BoursoramaApi instance
     * @param {string} clientNumber
     * @param {string} password
     */
    constructor(clientNumber, password) {
        this.clientNumber = clientNumber;
        this.password = password;

        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({headless: false});
        this.page = await this.browser.newPage();
    }

    async connect() {

        await this.page.goto('https://clients.boursorama.com/connexion');

        // Accept the cookies
        await this.page.click('#didomi-notice-agree-button');

        // Enter the client number
        await this.page.focus('#form_clientNumber');
        await this.page.keyboard.type(this.clientNumber);

        // Check the remember-me checkbox
        await this.page.click('body > main > div.js-transition-view__page.narrow-modal-window__page > form > div.js-transition-view__page.narrow-modal-window__page > div > div:nth-child(6) > div.login-spacer-remember-me > div');

        // Click on the validation button
        await this.page.click('body > main > div.js-transition-view__page.narrow-modal-window__page > form > div.js-transition-view__page.narrow-modal-window__page > div > div:nth-child(7) > div.u-text-center.o-vertical-interval-bottom > button');

        await this.page.waitForTimeout(2000);

        // Collect the keypad digits
        const passwordDigitsImages = await this.page.$$eval('.sasmap__img', images => images.map(image => (
            {
                svg: image.getAttribute('src')
            }
        )));

        // Click to each digit according to the password
        for (const digit of this.password) {
            const svgImage = passwordDigitsImages.find(image => this.PASSWORD_DIGITS_IMAGES[image.svg] === digit);
            this.page.click(`img[src="${svgImage.svg}"]`);
            await this.page.waitForTimeout(100);
        }

        // Click on the validation button to connect
        await this.page.click('body > main > div.js-transition-view__page.narrow-modal-window__page > form > div.js-transition-view__page.narrow-modal-window__page > div > div.narrow-modal-window__input-container > div.u-text-center.o-vertical-interval-bottom > div > div:nth-child(1) > button > span');

        await this.page.waitForTimeout(5000);

        await this.page.waitFor('#dashboard-amount-value');

        // Return the global balance amount once connected
        const totalBalance = await this.page.$eval('#dashboard-amount-value', element =>
            element.textContent);
        return Util.stringBalanceToNumber(totalBalance);
    }

    /**
     * Returns the accounts
     * @return {Promise<{totalBalance: number, accounts: Array<{label: string, balance: number}>}>}
     */
    async getAccounts() {

        this.page.goto('https://clients.boursorama.com');
        await this.page.waitForTimeout(3000);

        await this.page.waitFor('#dashboard-amount-value');
        const totalBalance = await this.page.$eval('#dashboard-amount-value', element =>
            element.textContent);

        const accounts = await this.page.$$eval('.c-panel__item, .c-info-box__item', elements =>
            elements.map(element => (
                {
                    label: element.firstElementChild.firstElementChild.firstElementChild.textContent,
                    balance: element.firstElementChild.firstElementChild.children[1].textContent
                }
            )));

        return {
            totalBalance: Util.stringBalanceToNumber(totalBalance),
            accounts: accounts.map(account => (
                {
                    label: account.label.trim(),
                    balance: Util.stringBalanceToNumber(account.balance)
                }
            ))
        };
    }
}

module.exports = BoursoramaApi;
