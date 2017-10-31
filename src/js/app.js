import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Poppins:700", "Roboto:300,400,700", "Roboto Slab:300"]
  }
});

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

// Load LiveChat
window.__lc = window.__lc || {};
window.__lc.license = 8928139;
(function() {
  var lc = document.createElement("script");
  lc.type = "text/javascript";
  lc.async = true;
  lc.src =
    ("https:" == document.location.protocol ? "https://" : "http://") +
    "cdn.livechatinc.com/tracking.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(lc, s);
})();

const utms = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
];

if (location.search) {
  let params = {};
  let parts = location.search.substring(1).split("&");
  const host = window.location.hostname.replace("www.", "");
  const expireDate = new Date();

  expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < utms.length; i++) {
    document.cookie =
      utms[i] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  for (let i = 0; i < parts.length; i++) {
    let nv = parts[i].split("=");

    if (utms.indexOf(nv[0]) != -1) {
      if (!nv[0]) continue;
      document.cookie =
        nv[0] +
        "=" +
        nv[1] +
        "; expires=" +
        expireDate.toGMTString() +
        "; path=/; domain=." +
        host;
    }
  }
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

  const section = document.querySelectorAll("h1,h2,h3");
  const offset = 40;
  let sections = {};

  Array.prototype.forEach.call(section, function(e) {
    sections[e.id] = e.offsetTop;
  });
  
  updateMenu()
  window.addEventListener("scroll", throttle(updateMenu, 50));

  function updateMenu() {
    var scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
      
    for (var section in sections) {
      if (sections[section] <= scrollPosition + offset) {
        let active = document.querySelector(".active");
        let links = document.querySelector("a[href*=" + section + "]");

        if (active) active.setAttribute("class", " ");
        if (links) links.setAttribute("class", "active");
      }
    }
  }
}

if (document.querySelector(".docs__sidebar")) 
  window.addEventListener("load", scrollSpy);

