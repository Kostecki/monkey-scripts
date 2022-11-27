// ==UserScript==
// @name         Ønskeskyen - Hvem gemmer sig?
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hvem gemmer sig bag reservationerne
// @author       You
// @match        https://xn--nskeskyen-k8a.dk/share/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xn--nskeskyen-k8a.dk
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const users = [
    {
      id: 12344,
      name: "Jacob K",
    },
    {
      id: 27165,
      name: "Helle K",
    },
    {
      id: 66859,
      name: "Jesper K",
    },
    {
      id: 83607,
      name: "Tonny K",
    },
  ];

  const listName = window.location.href.split("/share/")[1];
  const url = `https://api.xn--nskeskyen-k8a.dk/api/share/${listName}`;
  const userMap = [];

  const updateDOM = () => {
    const wishElements = document.querySelectorAll(".wish-list.sel li");
    if (wishElements.length) {
      userMap.forEach((e, i) => {
        if (e) {
          const elm = wishElements[i].querySelector(".reserve span");

          if (elm.innerHTML.includes("en anden")) {
            elm.innerHTML = `Reserveret af\n${e}`;
          }
        }
      });
    }
  };

  if (listName && listName !== "lists") {
    console.log("Ønskeskyen - Unhiding..");

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.wishes.forEach((wish, index) => {
          if (wish.statusOwner) {
            const user = users.find((user) => user.id === wish.statusOwner.id);
            userMap.push(user?.name ?? wish.statusOwner.id);
          } else {
            userMap.push(false);
          }
        });

        setTimeout(() => updateDOM(), 1000);
      });
  }
})();
