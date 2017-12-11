import "js-polyfills/url";
import storeMetrics from '@livechat/store-metrics';
import WebFont from "webfontloader";
import 'bootstrap/js/src/scrollspy';

// Store UTMs and referrer in cookies
storeMetrics();

var hamburgers = [].slice.call(document.querySelectorAll(".Nav__open"));
if (hamburgers.length > 0) {
  hamburgers.forEach(function(hamburger) {
    hamburger.addEventListener(
      "click",
      function() {
        this.classList.toggle("Nav__open--active");
        this.previousElementSibling.classList.toggle("Nav__menu--active");
      },
      false
    );
  });
}

function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

function scrollSpy() {
  "use strict";

  updateMenu()

  window.addEventListener("scroll", updateMenu);

  function updateMenu() {
    const sections = $(".active").siblings(".docs__toc__ul");
    const activeSections = $(".docs__toc__ul");

    [].forEach.call(activeSections, (el) => {
      $(el).removeClass('docs__toc__ul--active')
    });

    [].forEach.call(sections, (el) => {
      $(el).addClass('docs__toc__ul--active')
    });

  }
   
}

if (document.querySelector(".docs__sidebar")) 
  window.addEventListener("load", scrollSpy);

