(function () {
  "use strict";

  var namesEl = document.getElementById("names");
  var countEl = document.getElementById("count");
  var numEl = document.getElementById("num");
  var numLabel = document.getElementById("num-label");
  var msgEl = document.getElementById("msg");
  var resultEl = document.getElementById("result");
  var modeEls = document.querySelectorAll('input[name="mode"]');

  function readNames() {
    return namesEl.value
      .split("\n")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function currentMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function updateCount() {
    var n = readNames().length;
    countEl.textContent = n === 1 ? "שם אחד ברשימה" : n + " שמות ברשימה";
  }

  function updateLabel() {
    numLabel.textContent = currentMode() === "groups" ? "כמה קבוצות?" : "כמה אנשים בכל קבוצה?";
  }

  function render(groups) {
    resultEl.textContent = "";
    groups.forEach(function (members, i) {
      var box = document.createElement("div");
      box.className = "group";
      var h = document.createElement("h3");
      h.textContent = "קבוצה " + (i + 1);
      var ul = document.createElement("ul");
      members.forEach(function (name) {
        var li = document.createElement("li");
        li.textContent = name;
        ul.appendChild(li);
      });
      box.appendChild(h);
      box.appendChild(ul);
      resultEl.appendChild(box);
    });
  }

  // תמונה 2: מופנית מה-JavaScript. הנתיב יחסי למקום של index.html (הדף), לא של app.js
  function showEmpty() {
    resultEl.textContent = "";
    var box = document.createElement("div");
    box.className = "empty";
    var img = document.createElement("img");
    img.src = "assets/images/empty.svg";
    img.alt = "";
    box.appendChild(img);
    resultEl.appendChild(box);
  }

  // בודק שכל קובץ עזר באמת נטען, ומראה ✓ או ✗
  function checkAssets() {
    var files = [
      "assets/logo.svg",
      "assets/images/hero.svg",
      "assets/images/empty.svg",
      "assets/images/pattern.svg"
    ];
    var list = document.getElementById("asset-list");
    files.forEach(function (path) {
      var li = document.createElement("li");
      li.textContent = "… " + path;
      list.appendChild(li);
      var probe = new Image();
      probe.onload = function () {
        li.textContent = "";
        var s = document.createElement("span");
        s.className = "ok"; s.textContent = "✓";
        li.appendChild(s);
        li.appendChild(document.createTextNode(" " + path));
      };
      probe.onerror = function () {
        li.textContent = "";
        var s = document.createElement("span");
        s.className = "bad"; s.textContent = "✗";
        li.appendChild(s);
        li.appendChild(document.createTextNode(" " + path + " (not found)"));
      };
      probe.src = path;
    });
  }

  function split() {
    var names = readNames();
    var num = parseInt(numEl.value, 10);

    if (names.length === 0) {
      showEmpty();
      msgEl.textContent = "הרשימה ריקה. הוסיפו לפחות שם אחד.";
      return;
    }
    if (!num || num < 1) {
      msgEl.textContent = "הכניסו מספר גדול מאפס.";
      return;
    }

    var groupCount = currentMode() === "groups" ? num : Math.ceil(names.length / num);
    groupCount = Math.min(groupCount, names.length);

    var groups = [];
    for (var g = 0; g < groupCount; g++) groups.push([]);
    shuffle(names).forEach(function (name, i) {
      groups[i % groupCount].push(name);
    });

    render(groups);
    msgEl.textContent = names.length + " שמות חולקו ל-" + groupCount + " קבוצות.";
  }

  document.getElementById("go").addEventListener("click", split);
  document.getElementById("sample").addEventListener("click", function () {
    namesEl.value = ["דנה", "יוסי", "מיכל", "אחמד", "נועה", "רון", "שרה", "עומר", "ליאת", "תמר"].join("\n");
    updateCount();
  });
  namesEl.addEventListener("input", updateCount);
  Array.prototype.forEach.call(modeEls, function (el) {
    el.addEventListener("change", updateLabel);
  });

  updateCount();
  updateLabel();
  showEmpty();
  checkAssets();
})();
