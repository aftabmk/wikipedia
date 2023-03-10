import axios from "axios";

import { JSDOM } from "jsdom";

const url = "https://en.wikipedia.org/wiki/Lionel_Messi";

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

const getRank = async (url,OriginalUrl) => {
  try {
    const data = await axios(url, { method: "GET" });

    const res = data.data;

    const dom = new JSDOM(res);

    const $ = (el) => dom.window.document.querySelector(el);

    const rank = Number($(".mw-pvi-month").textContent.replaceAll(",", ""));

    return { OriginalUrl, rank };
  } catch (e) {
    return e.message;
  }
};

const getUrl = async (url) => {
  try {
    const array = [];

    const uri = "/wiki/";

    const data = await axios(url, { method: "GET" });

    const res = data.data;

    const dom = new JSDOM(res);

    const $ = (el) => dom.window.document.querySelector(el);

    const $$ = (el) => dom.window.document.querySelectorAll(el);

    const anchor = $$(".mw-parser-output a");

    anchor.forEach((el) => {
      if (el.href.includes(uri)) {
        array.push(`https://en.wikipedia.org${el.href}`);
      }
    });

    return array;
  } catch (e) {
    return e.message;
  }
};
const ur = [];

export const scrape = async (url) => {
  const array = await getUrl(url);
  const chunk = [...chunks(array, 100)];
//   console.log({len:array.length})
  for (let i = 0; i < chunk.length; i++) {
    const promiseArray = chunk[i].map((url) =>
      getRank(
        `https://en.wikipedia.org/w/index.php?title=${url
          .split("/")
          .at(-1)}&action=info`,url
      )
    );
    try {
      const scrapeData = (await Promise.all(promiseArray)).map(item => item);
      ur.push( ...scrapeData );
    } catch (error) {
      console.error(error);
    }
  }
  return ur
};

