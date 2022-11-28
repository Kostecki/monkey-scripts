// ==UserScript==
// @name         Parcels - Barcode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add barcode with tracking number to results page for quick mobile access.
// @author       You
// @match        https://parcelsapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parcelsapp.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/barcodes/JsBarcode.code128.min.js
// ==/UserScript==

(function () {
  "use strict";
  const insertBarcode = () => {
    const trackingInfoDOM = document.querySelector(".parcel-attributes");

    if (trackingInfoDOM) {
      const trackingNumber = trackingInfoDOM.querySelector(
        "tbody tr:first-of-type td:last-of-type"
      ).innerText;

      trackingInfoDOM.insertAdjacentHTML(
        "afterend",
        '<div style="margin-top: -6px; margin-bottom: 15px; display: flex; justify-content: center;"><svg id="barcode"></svg></div>'
      );

      JsBarcode("#barcode", trackingNumber);
    } else {
      setTimeout(() => insertBarcode(), 1000);
    }
  };

  insertBarcode();
})();
