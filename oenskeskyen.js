// ==UserScript==
// @name        Ønskeskyen.dk - Hvem giver?
// @namespace   Violentmonkey Scripts
// @match       https://onskeskyen.dk/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=xn--nskeskyen-k8a.dk
// @grant       none
// @version     1.0
// @author      Jacob Kostecki
// @description 3.3.2024 00.12.12
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

const maxTries = 20;
const retryInterval = 250;

const wishContainerClassPartial = "GridDefaultWishes__Grid";
const wishElementsClassPartial = "WishCard__WishCardContainer";
const wishElementOverlayClassPartial = "Overlays__ReservedText-sc";

const graphql = "https://api.gowish.com/graphql";
const query = {
  operationName: "getWishlistWishes",
  variables: {
    isLongQuery: true,
    id: "STk4AY3MIk69Pq9y",
    input: { cursor: 0, limit: 200 },
    sort: { field: "index", direction: "ASC" },
    filter: null,
  },
  query:
    "query getWishlistWishes($id: ID!, $input: PaginationInput, $sort: WishSortingInput, $filter: SearchTerm, $isLongQuery: Boolean!) {\n  wishlist(id: $id) {\n    id\n    wishes(input: $input, sort: $sort, filter: $filter) {\n      data {\n        ...WishItemWithDirectives\n        __typename\n      }\n      totalCount\n      nextCursor\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment WishItemWithDirectives on Wish {\n  description\n  id\n  price\n  quantity\n  photos\n  index\n  title\n  url\n  currency\n  labels\n  redirectUrl\n  reservations @include(if: $isLongQuery) {\n    quantity\n    reservedBy {\n      id\n      firstName\n      lastName\n      profileImage\n      __typename\n    }\n    __typename\n  }\n  next @include(if: $isLongQuery) {\n    id\n    index\n    __typename\n  }\n  prev @include(if: $isLongQuery) {\n    id\n    index\n    __typename\n  }\n  productRef @include(if: $isLongQuery) {\n    id\n    uurl\n    countryCode\n    originalUrl\n    domainName\n    brand {\n      id\n      logo\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
};

let savedUrl = "";

const fetchWishlist = async (url, payload) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

const addWishes = () => {
  const id = window.location.href.split("wishlists/")[1];
  const payload = { ...query, variables: { ...query.variables, id } };

  fetchWishlist(graphql, payload).then((resp) => {
    const wishes = resp.data.wishlist.wishes.data;
    const wishElements = Array.from(
      document.querySelectorAll(`[class^='${wishElementsClassPartial}']`)
    );

    wishes.forEach((wish, index) => {
      if (wish.reservations.length > 0) {
        const reservation = wish.reservations[0].reservedBy;
        const name = `${reservation.firstName} ${reservation.lastName}`;
        const newText = `<div style="text-align: center;">Reserveret af<br />${name.trim()}</div>`;

        try {
          wishElements[index].querySelector(
            `[class^='${wishElementOverlayClassPartial}']`
          ).innerHTML = newText;
        } catch (err) {
          console.error(wish, err);
        }
      }
    });
  });
};

const setup = () => {
  const currentUrl = window.location.href;
  if (currentUrl !== savedUrl) {
    savedUrl = currentUrl;

    let container = document.querySelector(
      `[class^='${wishContainerClassPartial}']`
    );
    let tries = 0;

    if (!container) {
      const checkExists = setInterval(() => {
        container = document.querySelector(
          `[class^='${wishContainerClassPartial}']`
        );

        if (container || tries > maxTries) {
          clearInterval(checkExists);

          if (container) {
            addWishes();
          }
        }

        tries++;
      }, retryInterval);
    } else {
      addWishes();
    }
  }
};

VM.observe(document.body, () => setup());
