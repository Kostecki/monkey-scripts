// ==UserScript==
// @name        Parcels - Barcode
// @namespace   Violentmonkey Scripts
// @match       https://parcelsapp.com/en/tracking/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=parcelsapp.com
// @grant       none
// @version     1.0
// @author      Jacob Kostecki
// @description 3.3.2024 00.56.48
// @require     https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/barcodes/JsBarcode.code128.min.js
// ==/UserScript==

const setup = () => {
  let trackingInfoTable = document.querySelector(".parcel-attributes");

  if (!trackingInfoTable) {
    const checkExists = setInterval(() => {
      trackingInfoTable = document.querySelector(".parcel-attributes");

      if (trackingInfoTable) {
        clearInterval(checkExists);

        if (trackingInfoTable) {
          setup();
        }
      }
    }, 100);
  } else {
    const trackingNumber = window.location.href.split("tracking/")[1];

    trackingInfoTable.insertAdjacentHTML(
      "afterend",
      '<div style="margin-top: -6px; margin-bottom: 15px; display: flex; justify-content: center;"><svg id="barcode"></svg></div>'
    );

    JsBarcode("#barcode", trackingNumber);
  }
};

setup();
