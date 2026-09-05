(function () {
  "use strict";

  /* ---------------------------------------------------------
     0. Lock scroll until invitation is opened
  --------------------------------------------------------- */
  document.documentElement.style.overflow = "hidden";

  /* ---------------------------------------------------------
     1. Open invitation
  --------------------------------------------------------- */
  var intro = document.getElementById("intro");
  var openBtn = document.getElementById("openInvite");
  var music = document.getElementById("bgMusic");
  var musicToggle = document.getElementById("musicToggle");

  function setPlayingState(isPlaying) {
    if (!musicToggle) return;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause background music" : "Play background music"
    );
  }

  function openInvitation() {
    intro.classList.add("is-open");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    // Opening the invitation is a genuine user gesture, so this is
    // the one reliable moment to start music without being blocked
    // by the browser's autoplay policy.
    if (music) {
      music.volume = 0.55;
      var playPromise = music.play();
      if (playPromise && playPromise.then) {
        playPromise.then(function () {
          setPlayingState(true);
        }).catch(function () {
          setPlayingState(false);
        });
      }
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", openInvitation);
  }

  if (musicToggle && music) {
    musicToggle.addEventListener("click", function () {
      if (music.paused) {
        music.play().then(function () {
          setPlayingState(true);
        }).catch(function () {});
      } else {
        music.pause();
        setPlayingState(false);
      }
    });
  }

  /* ---------------------------------------------------------
     2. Falling petals inside the intro seal screen
  --------------------------------------------------------- */
  var petalHost = document.querySelector(".intro__petals");
  if (petalHost) {
    var petalCount = window.innerWidth < 640 ? 14 : 24;
    for (var i = 0; i < petalCount; i++) {
      var p = document.createElement("span");
      var left = Math.random() * 100;
      var duration = 6 + Math.random() * 6;
      var delay = Math.random() * 8;
      var size = 6 + Math.random() * 6;
      p.style.left = left + "vw";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      p.style.background = Math.random() > 1.5 ? "#C9A24B" : "#E8CD8A";
      petalHost.appendChild(p);
    }
  }

  /* ---------------------------------------------------------
     3. Build the marigold garland (signature motif)
     Populates every .garland element with an SVG string of
     hanging flowers + leaves, generated procedurally so each
     divider feels hand-strung rather than a repeated image.
  --------------------------------------------------------- */
  function buildGarland(el) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1200 90");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("garland__svg");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "garland__string");
    path.setAttribute("d", "M0,12 Q150,86 300,22 T600,22 T900,22 T1200,12");
    svg.appendChild(path);
    el.innerHTML = "";
    el.appendChild(svg);

    var flowerCount = 26;
    var colors = ["#C9A24B", "#E8CD8A", "#B5793A"];
    var pathLength = path.getTotalLength();
    for (var i = 0; i <= flowerCount; i++) {
      var t = i / flowerCount;
      var point = path.getPointAtLength(t * pathLength);
      var x = point.x;
      var wave = point.y;
      var isLeaf = i % 5 === 0;

      var positionGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      positionGroup.setAttribute("transform", "translate(" + x.toFixed(1) + "," + wave.toFixed(1) + ")");
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "garland-flower");
      g.style.animationDuration = "10s";
      g.style.animationDelay = (t * 2.5).toFixed(2) + "s";

      if (isLeaf) {
        var leaf = document.createElementNS("http://www.w3.org/2000/svg", "path");
        leaf.setAttribute("d", "M0,0 C-6,6 -6,16 0,20 C6,16 6,6 0,0 Z");
        leaf.setAttribute("fill", "#33503F");
        g.appendChild(leaf);
      } else {
        var color = colors[i % colors.length];
        for (var k = 0; k < 6; k++) {
          var angle = (k / 6) * Math.PI * 2;
          var petal = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          petal.setAttribute("cx", (Math.cos(angle) * 5).toFixed(1));
          petal.setAttribute("cy", (Math.sin(angle) * 5).toFixed(1));
          petal.setAttribute("r", 4);
          petal.setAttribute("fill", color);
          g.appendChild(petal);
        }
        var centerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centerDot.setAttribute("cx", 0);
        centerDot.setAttribute("cy", 0);
        centerDot.setAttribute("r", 3);
        centerDot.setAttribute("fill", "#6E1E2B");
        g.appendChild(centerDot);
      }
      positionGroup.appendChild(g);
      svg.appendChild(positionGroup);
    }
  }

  document.querySelectorAll(".garland").forEach(buildGarland);

  /* ---------------------------------------------------------
     4. Countdown to the Baraat (11 Dec 2026, 6:00 PM IST)
  --------------------------------------------------------- */
  var TARGET = new Date("2026-12-11T18:00:00+05:30").getTime();

  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function tick() {
    var now = Date.now();
    var diff = TARGET - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);
    if (elSecs) elSecs.textContent = pad(secs);
  }

  if (elDays) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     5. Scroll-reveal: fade + rise each section into view once
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------------------------------------------------------
     6. Add to Calendar (.ics download, no backend required)
  --------------------------------------------------------- */
  var calBtn = document.getElementById("addCalendar");
  if (calBtn) {
    calBtn.addEventListener("click", function () {
      var ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Neha(Deepti) Sachin Wedding//EN",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@Neha(Deepti)-Sachin-wedding",
        "DTSTAMP:20261101T000000Z",
        "DTSTART:20261211T123000Z",
        "DTEND:20261211T160000Z",
        "SUMMARY:Neha (Deepti) & Sachin's Wedding",
        "DESCRIPTION:Baraat departs 19B\\, Ratanpur at 6:00 PM\\, proceeding to R.J. Garden for the wedding ceremony.",
        "LOCATION:R.J. Garden\\, Maksooda Bad\\, Panki\\, Kanpur - 208020",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "Neha(Deepti)-Sachin-Wedding.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
})();
