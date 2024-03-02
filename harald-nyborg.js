// ==UserScript==
// @name        Harald Nyborg to Clipboard
// @namespace   Violentmonkey Scripts
// @match       https://www.harald-nyborg.dk/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=harald-nyborg.dk
// @grant       none
// @version     1.0
// @author      -
// @description 2.3.2024 17.45.46
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

const successColor = "#4c9173";
const maxTries = 10;

const containerClassPartial = "styles__DetailsContainer";
const titleClassPartial = "styles__Title";
const productNumberClassPartial = "styles__ProductNumber";
const headerLogoClassPartial = "Header__Logo";

const setup = () => {
  let container = document.querySelector(`[class^='${containerClassPartial}']`);

  let tries = 0;

  if (!container) {
    const checkExist = setInterval(function () {
      container = document.querySelector(`[class^='${containerClassPartial}']`);

      if (container || tries > maxTries) {
        clearInterval(checkExist);

        if (container) {
          setup();
        }
      }

      tries++;
    }, 100);
  } else {
    const name = document.querySelector(`[class^='${titleClassPartial}']`);
    name.addEventListener("click", clickHandler);
    name.style.cursor = "pointer";

    const id = document.querySelector(
      `[class^='${productNumberClassPartial}']`
    );
    id.style.color = successColor;
  }
};

const clickHandler = () => {
  const name = document.title;
  const nameElement = document.querySelector(`[class^='${titleClassPartial}']`);
  const idElement = document.querySelector(
    `[class^='${productNumberClassPartial}']`
  );
  const id = idElement.innerText.split(". ")[1];
  const fullString = `${name} (${id})`;

  navigator.clipboard.writeText(fullString).then(() => {
    const oldColor = nameElement.style.color;
    nameElement.style.color = successColor;
    setTimeout(() => (nameElement.style.color = oldColor), 1500);
  }),
    () => alert("failed");
};

setup();

VM.observe(document.body, () => setup());
