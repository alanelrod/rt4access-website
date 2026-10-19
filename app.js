/* Public copies of two RT4Access maps: the NC 500, and the Palantir location orbit. */
(function () {
  const esc = (s) => String(s || "").replace(/[<>&]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[ch]));
  const attr = (s) => esc(s).replace(/"/g, "&quot;");
  const clip = (s, n) => (String(s || "").length > n ? String(s).slice(0, n - 1) + "…" : String(s || ""));

  const rowsEl = document.querySelector("#rows");
  const note = document.querySelector("#note");
  const donut = document.querySelector("#donut");
  const legend = document.querySelector("#legend");
  const q = document.querySelector("#q");
  const groupButton = document.querySelector("#group-button");
  const groupPanel = document.querySelector("#group-panel");
  const groupAll = document.querySelector("#group-all");
  const groupHeaders = document.querySelector("#group-headers");
  const groupSectors = document.querySelector("#group-sectors");
  const selectedSectors = new Set();
  const colors = ["#5eead4", "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8", "#a78bfa", "#2dd4bf", "#67e8f9", "#93c5fd", "#c4b5fd"];
  const otherColor = "#334155";
  let ranked = [];
  let openPos = null;
  const rowByPos = new Map();

  function visible(text) {
    return String(text || "")
      .replace(/\bForbes\b/g, "the published list")
      .replace(/\bbest guess\b/gi, "modeled estimate")
      .replace(/\breal[ -]time estimates\b/gi, "modeled estimates")
      .replace(/\breal[ -]time estimate\b/gi, "published figure")
      .replace(/\bGuesses\b/g, "Modeled estimates")
      .replace(/\bGuess\b/g, "Modeled estimate");
  }

  const TRIANGLE = new Set(["raleigh", "durham", "cary", "chapel hill", "morrisville", "apex", "holly springs", "carrboro", "research triangle park", "research triangle", "rtp", "wake forest", "knightdale", "garner", "hillsborough", "pittsboro"]);
  const CHARLOTTE = new Set(["charlotte", "eastover", "huntersville", "matthews", "cornelius", "davidson", "mint hill", "pineville", "indian trail", "waxhaw", "belmont", "mount holly", "concord", "kannapolis", "weddington", "harrisburg"]);
  const PLACES = ["Research Triangle Park", "Research Triangle", "Winston-Salem", "Chapel Hill", "Rocky Mount", "High Point", "New Bern", "Southern Pines", "Holly Springs", "Morehead City", "North Wilkesboro", "Elizabeth City", "Huntersville", "Fayetteville", "Greensboro", "Wilmington", "Asheville", "Charlotte", "Valle Crucis", "Pisgah Forest", "Spring Hope", "Snow Hill", "Rose Hill", "Mount Airy", "Mount Olive", "Mount Holly", "Wake Forest", "Indian Trail", "Fuquay-Varina", "Pinehurst", "Mooresville", "Kannapolis", "Statesville", "Hendersonville", "Jacksonville", "Morrisville", "Greenville", "Goldsboro", "Burlington", "Lexington", "Thomasville", "Kernersville", "Salisbury", "Morganton", "Asheboro", "Lumberton", "Hickory", "Gastonia", "Concord", "Raleigh", "Durham", "Cary", "Apex", "Boone", "Lenoir", "Conover", "Sanford", "Kinston", "Wilson", "Monroe", "Shelby", "Newton Grove", "Newton", "Valdese", "Marion", "Brevard", "Sylva", "Franklin", "Waynesville", "Jefferson", "Nashville", "Lucama", "Oakboro", "Emerald Isle", "Smithfield", "Clayton", "Garner", "Carrboro", "Hillsborough", "Pittsboro", "Mebane", "Graham", "Reidsville", "Albemarle", "Eden", "Matthews", "Cornelius", "Davidson", "Eastover", "Washington", "Pineville", "Belmont", "Lincolnton", "Clinton", "Wallace", "Tarboro", "Oxford", "Hamlet", "Laurinburg", "Aberdeen", "Waxhaw", "Blowing Rock", "Banner Elk", "Four Oaks", "Sandy Ridge", "Rural Hall", "Wilkesboro", "Jamestown", "Troutman", "Shallotte", "Penrose", "Archdale", "Hayesville", "Weddington", "Harrisburg", "Knightdale", "Wade", "Newland", "Littleton", "Burnsville", "Carthage", "Ahoskie", "Elizabethtown", "Salemburg", "Eagle Springs"];
  PLACES.sort((a, b) => b.length - a.length);
  const COMPANY_REGION = {
    "Pamlico Capital": "Charlotte", "Prometheus Group": "RTP", "Smart Choice": "Greensboro", "Joe Van Gogh": "RTP",
    "Yep Roc and related labels": "RTP", "Salem One": "Winston-Salem", "Passport": "Charlotte", "Glew": "Charlotte",
    "Armor Fire Services": "Charlotte", "Winston Tractor": "Winston-Salem", "Amerochem": "New Bern", "Jernigan Oil": "Ahoskie",
    "Smith Oil": "Salemburg", "Campbell Oil": "Elizabethtown", "Williams Sand and Clay": "Eagle Springs", "Fence Builders": "Winston-Salem",
    "Green Hill Fence": "South Carolina", "Dalco Nonwovens": "Conover", "Alarmguard Security": "Greensboro", "Pesta Finnie": "Charlotte",
  };

  function regionName(name) {
    const key = name.toLowerCase();
    if (TRIANGLE.has(key)) return "RTP";
    if (CHARLOTTE.has(key)) return "Charlotte";
    return name;
  }
  function awayState(text) {
    const match = text.match(/\blives in [^.]{0,80}\b(Florida|Maryland|South Carolina|Virginia|Georgia|Tennessee|Texas|New York|California)\b/i)
      || text.match(/\bplaces (?:him|her) in [^.]{0,60}\b(Florida|Maryland|South Carolina|Virginia|Georgia|Tennessee|Texas|New York|California)\b/i)
      || text.match(/\bfiling address is [^.]{0,60}\b(Florida|Maryland|South Carolina|Virginia|Georgia|Tennessee|Texas|New York|California)\b/i);
    if (!match) return "";
    return match[1].toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  function placeOf(person) {
    const text = person.nc_tie || "";
    const away = awayState(text + " " + (person.valuation_note || ""));
    if (away) return away;
    const found = [];
    for (const name of PLACES) {
      const pattern = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (pattern.test(text)) {
        const region = regionName(name);
        if (!found.includes(region)) found.push(region);
      }
    }
    if (found.includes("Charlotte") && found.includes("RTP")) return "North Carolina";
    if (found.length) return found[0];
    if (/triangle-based|research triangle|\bRTP\b|in the Triangle/i.test(text)) return "RTP";
    const county = text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+)?) County\b/);
    if (county && county[1] !== "North") return county[1] + " County";
    if (COMPANY_REGION[person.company]) return COMPANY_REGION[person.company];
    return "North Carolina";
  }
  function assignRegions(people) {
    people.forEach((person) => { person.region = placeOf(person); });
    const byCompany = new Map();
    people.forEach((person) => {
      if (!person.company || person.region === "North Carolina") return;
      if (!byCompany.has(person.company)) byCompany.set(person.company, new Set());
      byCompany.get(person.company).add(person.region);
    });
    people.forEach((person) => {
      const regions = byCompany.get(person.company);
      if (person.region === "North Carolina" && regions && regions.size === 1) person.region = [...regions][0];
    });
  }
  function money(value) {
    if (value >= 1e9) return "$" + (value / 1e9).toFixed(2).replace(/0$/, "").replace(/\.0$/, "") + "B";
    return "$" + (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  function arc(cx, cy, outer, inner, a0, a1) {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const [x0, y0] = p(outer, a0);
    const [x1, y1] = p(outer, a1);
    const [x2, y2] = p(inner, a1);
    const [x3, y3] = p(inner, a0);
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${outer} ${outer} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${inner} ${inner} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
  }
  function worthOf(person) {
    return person.valuation === "priced" ? person.model_base : (person.best_guess || person.model_base);
  }
  function groupBuckets(people) {
    const buckets = new Map();
    for (const person of people) {
      const key = person.sector || "Services";
      if (!buckets.has(key)) buckets.set(key, { name: key, value: 0, people: [] });
      const bucket = buckets.get(key);
      bucket.value += worthOf(person);
      bucket.people.push(person);
    }
    return [...buckets.values()].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  }
  function chosenPeople() {
    const needle = q.value.trim().toLowerCase();
    return ranked.filter((person) => {
      if (needle && !person.hay.includes(needle)) return false;
      if (selectedSectors.size && !selectedSectors.has(person.sector)) return false;
      return true;
    });
  }
  function drawDonut() {
    const people = chosenPeople();
    const total = people.reduce((sum, person) => sum + worthOf(person), 0);
    document.querySelector("#donut-total").textContent = total ? money(total) : "$0";
    donut.replaceChildren();
    legend.replaceChildren();
    if (!total) return;
    const byGroup = selectedSectors.size > 1;
    let parts;
    if (byGroup) {
      parts = groupBuckets(people).map((bucket) => ({ name: bucket.name, value: bucket.value, sector: bucket.name, count: bucket.people.length }));
    } else {
      const top = people.filter((person) => worthOf(person) >= 100000000);
      const rest = people.filter((person) => worthOf(person) < 100000000);
      parts = top.map((person) => ({ name: person.name, value: worthOf(person), pos: person.position }));
      if (rest.length) {
        parts.push({
          name: "Everyone else",
          value: rest.reduce((sum, person) => sum + worthOf(person), 0),
          pos: rest[0].position,
          rest: true,
          count: rest.length,
        });
      }
    }
    let angle = -Math.PI / 2;
    parts.forEach((part, index) => {
      const sweep = (part.value / total) * Math.PI * 2;
      const start = angle;
      angle += sweep;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const color = part.rest ? otherColor : colors[index % colors.length];
      part.color = color;
      const gap = Math.min(0.006, sweep * 0.12);
      path.setAttribute("d", arc(110, 110, 96, 62, start, Math.max(start + 0.001, angle - gap)));
      path.setAttribute("fill", color);
      path.addEventListener("click", () => {
        if (part.sector) selectOnly(part.sector);
        else focusPerson(part.pos);
      });
      donut.append(path);
    });
    const legendRows = byGroup
      ? parts
      : people.map((person) => {
        const match = parts.find((part) => part.pos === person.position);
        return { name: person.name, value: worthOf(person), pos: person.position, color: match ? match.color : otherColor };
      });
    legendRows.forEach((part) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      const label = document.createElement("span");
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = part.color || otherColor;
      label.append(swatch, document.createTextNode(part.name));
      const amount = document.createElement("span");
      amount.textContent = money(part.value);
      button.append(label, amount);
      button.addEventListener("click", () => {
        if (part.sector) selectOnly(part.sector);
        else focusPerson(part.pos);
      });
      li.append(button);
      legend.append(li);
    });
  }
  function tidy(value) {
    const step = value >= 1e9 ? 5e7 : value >= 1e8 ? 5e6 : value >= 1e7 ? 5e5 : value >= 1e6 ? 5e4 : 1e4;
    return Math.max(step, Math.round(value / step) * step);
  }
  function yearLabel(date) {
    if (date === "Now") return "Now";
    const year = String(date).match(/\d{4}/);
    return year ? "’" + year[0].slice(2) : String(date);
  }
  function labelFor(person) {
    if (person.evidence_class === "published_figure") return "Published figure";
    if (person.evidence_class === "market_holding") return "Market holding";
    if (person.evidence_class === "documented_proceeds") return "Documented proceeds";
    return "Modeled estimate";
  }
  function movementText(person) {
    if (person.movement === "up" && person.rank_delta) return "▲ " + person.rank_delta;
    if (person.movement === "down" && person.rank_delta) return "▼ " + Math.abs(person.rank_delta);
    if (person.movement === "added") return "New";
    if (person.movement === "repriced") return "Repriced";
    return "";
  }
  function seriesOf(person) {
    if (person.history && person.history.length) {
      const points = person.history.map((point) => ({ date: point.date, value: point.value }));
      if (person.realtime) points.push({ date: "Now", value: person.realtime });
      return { kind: "realtime", points };
    }
    const end = worthOf(person);
    let hash = 2166136261;
    for (let i = 0; i < person.name.length; i++) hash = Math.imul(hash ^ person.name.charCodeAt(i), 16777619);
    const years = [2021, 2022, 2023, 2024, 2025, 2026];
    const points = years.map((year, index) => {
      if (index === years.length - 1) return { date: String(year), value: end };
      const t = index / (years.length - 1);
      const wobble = (((hash >>> (index * 3)) & 15) - 7) / 100;
      const level = Math.min(1.08, Math.max(0.4, 0.62 + 0.38 * t + wobble));
      return { date: String(year), value: tidy(end * level) };
    });
    return { kind: "guess", points };
  }
  function historyChart(person) {
    const series = seriesOf(person);
    const vals = series.points.map((point) => point.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 320 148");
    svg.setAttribute("width", "100%");
    const x = (index) => 18 + (index / Math.max(series.points.length - 1, 1)) * 284;
    const y = (value) => 16 + (1 - (value - min) / Math.max(max - min, 1)) * 96;
    const color = "#5eead4";
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", series.points.map((point, index) => x(index).toFixed(1) + "," + y(point.value).toFixed(1)).join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "2");
    svg.append(line);
    const wrap = document.createElement("div");
    wrap.className = "history-chart";
    const tip = document.createElement("div");
    tip.className = "history-tip";
    tip.hidden = true;
    series.points.forEach((point, index) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x(index).toFixed(1));
      dot.setAttribute("cy", y(point.value).toFixed(1));
      dot.setAttribute("r", "4");
      dot.setAttribute("fill", "#070b14");
      dot.setAttribute("stroke", color);
      dot.setAttribute("stroke-width", "2");
      const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      hit.setAttribute("cx", x(index).toFixed(1));
      hit.setAttribute("cy", y(point.value).toFixed(1));
      hit.setAttribute("r", "12");
      hit.setAttribute("fill", "transparent");
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x(index).toFixed(1));
      label.setAttribute("y", "142");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", "#93a4bd");
      label.setAttribute("font-size", "10");
      label.textContent = yearLabel(point.date);
      const show = () => {
        tip.hidden = false;
        tip.replaceChildren();
        const when = document.createElement("span");
        when.textContent = point.date === "Now" ? "Now" : String(point.date);
        const amount = document.createElement("strong");
        amount.textContent = money(point.value);
        tip.append(when, amount);
        tip.style.left = (x(index) / 320 * 100) + "%";
        tip.style.top = (y(point.value) / 148 * 100) + "%";
      };
      hit.addEventListener("mouseenter", show);
      hit.addEventListener("mouseleave", () => { tip.hidden = true; });
      svg.append(dot, label, hit);
    });
    wrap.append(svg, tip);
    const caption = series.kind === "realtime" ? labelFor(person) : labelFor(person) + ". Illustrative path, not a reported history.";
    return { node: wrap, caption };
  }
  function paintOpen() {
    for (const [pos, pair] of rowByPos) {
      const open = pos === openPos && !pair.row.hidden;
      pair.detail.hidden = !open;
    }
  }
  function toggle(position) {
    openPos = openPos === position ? null : position;
    paintOpen();
  }
  const SECTOR = {
    Software: "Tech", "Enterprise software": "Tech", "Gaming software": "Tech", Telecom: "Tech",
    "Private equity": "Finance", "Venture capital": "Finance", "Asset management": "Finance", Banking: "Finance", Insurance: "Finance", "Tax services": "Finance",
    Logistics: "Logistics", Freight: "Logistics", Aviation: "Logistics",
    "Real estate": "Real estate", Homebuilding: "Real estate",
    "Healthcare services": "Healthcare", Biotech: "Healthcare", "Medical devices": "Healthcare",
    "Oil and gas": "Energy", Solar: "Energy", Energy: "Energy",
    Construction: "Construction", "Building materials": "Construction", Architecture: "Construction", Engineering: "Construction", Roofing: "Construction", Pavement: "Construction", Facilities: "Construction",
    Agriculture: "Agriculture", Restaurants: "Food", Food: "Food", Beverages: "Food", "Beverage distribution": "Food", Grocery: "Food",
    Retail: "Retail", "Auto retail": "Retail", "Consumer products": "Retail", Furniture: "Retail",
    Manufacturing: "Manufacturing", Equipment: "Manufacturing", Textiles: "Manufacturing", Chemicals: "Manufacturing", Boats: "Manufacturing", Packaging: "Manufacturing",
    Media: "Media", Marketing: "Media", Music: "Media", Printing: "Media",
    "Home services": "Services", Landscaping: "Services", "Pest control": "Services", "Collision repair": "Services", Waste: "Services", Law: "Services", "Professional services": "Services", Staffing: "Services", Franchising: "Services", Funeral: "Services", Hospitality: "Services", Education: "Services", Sports: "Services",
  };
  function sectorOf(person) {
    return SECTOR[person.industry] || person.industry || "Services";
  }
  function groupLabel() {
    if (!selectedSectors.size) return "All industries";
    return [...selectedSectors].sort((a, b) => a.localeCompare(b)).join(", ");
  }
  function syncGroupChecks() {
    groupAll.checked = selectedSectors.size === 0;
    groupSectors.querySelectorAll("input").forEach((box) => { box.checked = selectedSectors.has(box.value); });
    groupButton.textContent = groupLabel();
  }
  function selectOnly(sector) {
    selectedSectors.clear();
    selectedSectors.add(sector);
    q.value = "";
    syncGroupChecks();
    render();
  }
  function render() {
    rowsEl.replaceChildren();
    rowByPos.clear();
    const people = chosenPeople();
    const grouped = groupHeaders.checked || selectedSectors.size > 1;
    drawDonut();
    const paint = (person) => build(person);
    if (!grouped) people.forEach(paint);
    else {
      const buckets = new Map();
      for (const person of people) {
        const key = person.sector || "Services";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(person);
      }
      const names = [...buckets.keys()].sort((a, b) => {
        const sum = (key) => buckets.get(key).reduce((total, person) => total + worthOf(person), 0);
        return sum(b) - sum(a) || a.localeCompare(b);
      });
      for (const name of names) {
        const header = document.createElement("tr");
        header.className = "industry-head";
        const cell = document.createElement("td");
        cell.colSpan = 7;
        cell.textContent = name;
        header.append(cell);
        rowsEl.append(header);
        buckets.get(name).forEach(paint);
      }
    }
    paintOpen();
  }
  function focusPerson(position) {
    const person = ranked.find((row) => row.position === position);
    q.value = "";
    if (person && selectedSectors.size && !selectedSectors.has(person.sector)) {
      selectedSectors.clear();
      syncGroupChecks();
    }
    render();
    openPos = position;
    paintOpen();
    const pair = rowByPos.get(position);
    if (pair) pair.row.scrollIntoView({ block: "center" });
  }
  function build(person) {
    const row = document.createElement("tr");
    row.className = "rank-row";
    const rank = document.createElement("td");
    rank.className = "pos";
    rank.textContent = String(person.rank);
    const move = movementText(person);
    if (move) {
      const mark = document.createElement("span");
      mark.className = "move";
      mark.textContent = move;
      rank.append(mark);
    }
    const name = document.createElement("td");
    name.className = "rank-name";
    name.textContent = person.name;
    const worth = document.createElement("td");
    worth.className = "worth";
    worth.textContent = money(worthOf(person));
    const age = document.createElement("td");
    const place = document.createElement("td");
    place.textContent = person.region || "North Carolina";
    const source = document.createElement("td");
    source.textContent = person.company || "";
    const industry = document.createElement("td");
    industry.textContent = person.industry || "";
    row.append(rank, name, worth, age, place, source, industry);
    row.addEventListener("click", () => toggle(person.position));
    const detail = document.createElement("tr");
    detail.hidden = true;
    const cell = document.createElement("td");
    cell.colSpan = 7;
    const panel = document.createElement("div");
    panel.className = "rank-panel";
    const copy = document.createElement("div");
    const why = document.createElement("p");
    why.textContent = visible(person.best_guess_why || "");
    const text = document.createElement("p");
    text.textContent = visible(person.valuation_note || "");
    const tie = document.createElement("p");
    tie.className = "tie";
    tie.textContent = person.nc_tie || "";
    const link = document.createElement("a");
    link.href = person.source || "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "profile";
    link.textContent = "Source";
    const meta = document.createElement("p");
    meta.className = "tie";
    const bits = [labelFor(person)];
    if (person.valued_at) bits.push("Valued " + person.valued_at);
    if (person.freshness) bits.push(visible(person.freshness));
    if (person.previous_base) bits.push("Previous estimate " + money(person.previous_base));
    meta.textContent = bits.join(" ");
    copy.append(why, text, tie, meta);
    if (person.source) copy.append(link);
    const chart = document.createElement("div");
    const title = document.createElement("div");
    title.className = "range-title";
    const drawn = historyChart(person);
    title.textContent = drawn.caption;
    chart.append(title, drawn.node);
    panel.append(copy, chart);
    cell.append(panel);
    detail.append(cell);
    rowsEl.append(row, detail);
    rowByPos.set(person.position, { row, detail });
  }

  q.addEventListener("input", render);
  groupButton.addEventListener("click", () => {
    const open = groupPanel.hidden;
    groupPanel.hidden = !open;
    groupButton.setAttribute("aria-expanded", open ? "true" : "false");
  });
  groupAll.addEventListener("change", () => {
    selectedSectors.clear();
    syncGroupChecks();
    render();
  });
  groupHeaders.addEventListener("change", render);
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".group-menu")) {
      groupPanel.hidden = true;
      groupButton.setAttribute("aria-expanded", "false");
    }
  });

  function showRanking(list, headline) {
    ranked = list;
    assignRegions(ranked);
    ranked.forEach((person, index) => {
      person.rank = person.rank || index + 1;
      person.industry = person.industry || "Other";
      person.sector = sectorOf(person);
      person.position = person.position || person.name;
      person.hay = (person.name + " " + (person.company || "") + " " + person.industry + " " + person.sector + " " + (person.region || "")).toLowerCase();
    });
    const industries = [...new Set(ranked.map((person) => person.sector))].sort((a, b) => a.localeCompare(b));
    groupSectors.replaceChildren();
    for (const name of industries) {
      const label = document.createElement("label");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.value = name;
      box.addEventListener("change", () => {
        if (box.checked) selectedSectors.add(name);
        else selectedSectors.delete(name);
        syncGroupChecks();
        render();
      });
      label.append(box, document.createTextNode(" " + name));
      groupSectors.append(label);
    }
    note.textContent = headline;
    openPos = ranked[0] && ranked[0].position;
    render();
  }

  const GEO_REGIONS = [
    ["Americas", "#60a5fa", ["New York", "Washington", "Palo Alto", "Seattle", "Chicago", "Denver", "Aventura", "Ottawa"], 300, 390],
    ["Europe", "#34d399", ["London", "Paris", "Madrid", "Munich", "Amsterdam", "Copenhagen", "Oslo", "Stockholm", "Rome", "Zurich", "Warsaw"], 860, 220],
    ["Middle East", "#fbbf24", ["Tel Aviv", "Abu Dhabi", "Doha"], 1360, 360],
    ["Asia-Pacific", "#f472b6", ["Tokyo", "Seoul", "Sydney", "Canberra"], 1280, 800],
  ];
  const REGION_MARKERS = [
    ["Americas", ["united states", "canada", "greater boston", "greater houston", "greater milwaukee"]],
    ["Europe", ["united kingdom", "england", "scotland", "wales", "france", "italy", "germany", "spain", "netherlands", "poland", "lithuania", "luxembourg", "switzerland", "vilniaus", "sweden", "norway", "denmark"]],
    ["Middle East", ["united arab emirates", "israel", "qatar"]],
    ["Asia-Pacific", ["australia", "india", "japan", "korea", "karnataka", "haryana"]],
  ];
  let orbitPeople = [];
  let orbitTrail = [];

  function bucketOf(row) {
    if (row.office) return row.office;
    if (row.place) return row.place;
    return "No location";
  }
  function regionFor(name, row) {
    const home = GEO_REGIONS.find((region) => region[2].includes(name));
    if (home) return home[0];
    if (name === "No location" || name === "Headquarters" || name === "Remote" || name === "HQ") return "";
    const text = String((row && row.location) || name).toLowerCase();
    const hit = REGION_MARKERS.find(([, words]) => words.some((word) => text.includes(word)));
    return hit ? hit[0] : "";
  }
  function bucketsOf(people) {
    const buckets = new Map();
    people.forEach((row) => {
      const label = bucketOf(row);
      const list = buckets.get(label) || [];
      list.push(row);
      buckets.set(label, list);
    });
    return buckets;
  }
  function regionGroups(buckets) {
    const groups = new Map(GEO_REGIONS.map((region) => [region[0], []]));
    const elsewhere = [];
    buckets.forEach((rows, name) => {
      const region = regionFor(name, rows[0]);
      if (region && groups.has(region)) groups.get(region).push(name);
      else elsewhere.push(name);
    });
    return { groups, elsewhere };
  }
  function regionNames(region, buckets, groups, overview) {
    const offices = region[2].filter((name) => buckets.has(name));
    const extras = (groups.get(region[0]) || [])
      .filter((name) => !region[2].includes(name))
      .filter((name) => !overview || buckets.get(name).length >= 2)
      .sort((a, b) => buckets.get(b).length - buckets.get(a).length || a.localeCompare(b));
    return offices.concat(extras);
  }
  function regionCount(region, buckets, groups) {
    return (groups.get(region[0]) || []).reduce((sum, name) => sum + buckets.get(name).length, 0);
  }
  function massRadius(count) {
    return Math.max(11, Math.min(22, 7 + Math.sqrt(count || 1)));
  }
  function clusterOrbit(names, buckets, coreR) {
    if (!names.length) return coreR + 48;
    const widest = Math.max(...names.map((name) => massRadius((buckets.get(name) || []).length)));
    const fit = (names.length * (widest * 2 + 52)) / (2 * Math.PI);
    return Math.max(coreR + widest + 40, fit);
  }
  function polar(cx, cy, radius, index, total) {
    const angle = -Math.PI / 2 + (total ? index / total : 0) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  }
  function solarFrame(width, height, label, inner) {
    const stars = [[80, 60], [140, 180], [200, 40], [320, 90], [480, 50], [760, 40], [900, 70], [1080, 50], [1140, 160], [70, 320], [160, 700], [400, 720], [700, 40], [1040, 700], [1120, 480], [40, 520], [560, 700], [820, 730]];
    const sky = stars.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#94a3b8" fill-opacity="0.7"></circle>`).join("");
    return `<div class="pyramid-stage"><svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${attr(label)}">${sky}${inner}</svg></div>`;
  }
  function orbitRing(cx, cy, radius, color) {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-dasharray="3 6"></circle>`;
  }
  function planet(name, spot, count, color, hook, showCount, inside) {
    const tally = showCount ? `<text x="${spot.x}" y="${spot.y + (inside ? -2 : 4)}" text-anchor="middle" fill="#e8eef7" font-size="10">${count}</text>` : "";
    const label = inside
      ? `<text x="${spot.x}" y="${spot.y + (showCount ? 12 : 4)}" text-anchor="middle" fill="#e8eef7" font-size="10">${esc(clip(name, 16))}</text>`
      : `<text x="${spot.x}" y="${spot.y + spot.r + 14}" text-anchor="middle" fill="#e8eef7" font-size="11">${esc(clip(name, 16))}</text>`;
    return `<g ${hook} style="${hook ? "cursor:pointer" : ""}">
      <circle cx="${spot.x}" cy="${spot.y}" r="${spot.r + 8}" fill="transparent"></circle>
      <circle cx="${spot.x}" cy="${spot.y}" r="${spot.r}" fill="#0b1220" stroke="${color}" stroke-width="1.6"></circle>
      ${tally}${label}
    </g>`;
  }
  function companySolar(buckets, groups, elsewhere) {
    const width = 1600;
    const height = 1080;
    const sun = { x: 800, y: 540, r: 46 };
    const clusters = GEO_REGIONS.map((region) => ({
      name: region[0],
      color: region[1],
      names: regionNames(region, buckets, groups, true),
      count: regionCount(region, buckets, groups),
      x: region[3],
      y: region[4],
    }));
    const elseCount = elsewhere.reduce((sum, name) => sum + (buckets.get(name) || []).length, 0);
    const elseNames = elsewhere.slice().sort((a, b) => buckets.get(b).length - buckets.get(a).length).slice(0, 8);
    clusters.push({ name: "Elsewhere", color: "#94a3b8", names: elseNames, count: elseCount, x: 340, y: 860 });
    const rings = clusters.map((cluster) => {
      const coreR = Math.max(34, cluster.name.length * 4.1, massRadius(cluster.count) + 10);
      const orbit = clusterOrbit(cluster.names, buckets, coreR);
      return orbitRing(cluster.x, cluster.y, orbit, cluster.color)
        + `<line x1="${sun.x}" y1="${sun.y}" x2="${cluster.x}" y2="${cluster.y}" stroke="#334155" stroke-width="1"></line>`
        + cluster.names.map((office, index) => {
          const spot = polar(cluster.x, cluster.y, orbit, index, cluster.names.length);
          const officeRows = buckets.get(office) || [];
          spot.r = massRadius(officeRows.length);
          return planet(office, spot, officeRows.length, cluster.color, `data-office="${attr(office)}" role="button" tabindex="0"`, true, false);
        }).join("")
        + planet(cluster.name, { x: cluster.x, y: cluster.y, r: coreR }, cluster.count, cluster.color, `data-geo="${attr(cluster.name)}" role="button" tabindex="0"`, true, true);
    }).join("");
    const core = `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="#0c2340" stroke="#f8fafc" stroke-width="1.5"></circle>
      <text x="${sun.x}" y="${sun.y + 4}" text-anchor="middle" fill="#f8fafc" font-size="13">Palantir</text>`;
    return solarFrame(width, height, "Office clusters", rings + core);
  }
  function regionSolar(name, color, names, buckets) {
    const width = 1100;
    const height = 760;
    const sun = { x: width / 2, y: height / 2 };
    const total = names.reduce((sum, office) => sum + (buckets.get(office) || []).length, 0);
    const ordered = names.slice().sort((a, b) => (buckets.get(b) || []).length - (buckets.get(a) || []).length).slice(0, 20);
    const orbit = 250;
    const moons = ordered.map((office, index) => {
      const officeRows = buckets.get(office) || [];
      const spot = polar(sun.x, sun.y, orbit, index, ordered.length);
      spot.r = massRadius(officeRows.length) + 4;
      return planet(office, spot, officeRows.length, color, `data-office="${attr(office)}" role="button" tabindex="0"`, true, false);
    }).join("");
    const core = planet(name, { x: sun.x, y: sun.y, r: Math.max(46, name.length * 4) }, total, color, "", true, true);
    return solarFrame(width, height, name, orbitRing(sun.x, sun.y, orbit, color) + moons + core);
  }
  function peopleSolar(title, office, members) {
    const leaders = members.filter((row) => row.lead);
    const rest = members.filter((row) => !row.lead).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const ordered = leaders.concat(rest);
    const width = 1100;
    const height = 820;
    const sun = { x: width / 2, y: height / 2, r: 36 };
    let cursor = 0;
    let ring = 0;
    const spots = [];
    while (cursor < ordered.length) {
      const capacity = 12 + ring * 8;
      const slice = ordered.slice(cursor, cursor + capacity);
      const radius = 110 + ring * 48;
      slice.forEach((row, index) => {
        const spot = polar(sun.x, sun.y, radius, index, slice.length);
        spot.r = row.lead ? 14 : 7;
        spot.person = row;
        spots.push(spot);
      });
      cursor += capacity;
      ring += 1;
    }
    const moons = spots.map((spot) => {
      const name = spot.person.lead ? `<text x="${spot.x}" y="${spot.y + spot.r + 12}" text-anchor="middle" fill="#e8eef7" font-size="10">${esc(clip(spot.person.name, 16))}</text>` : "";
      return `<g data-person="${attr(spot.person.name)}" role="button" tabindex="0" style="cursor:pointer">
        <circle cx="${spot.x}" cy="${spot.y}" r="${spot.r + 6}" fill="transparent"></circle>
        <circle cx="${spot.x}" cy="${spot.y}" r="${spot.r}" fill="#0b1220" stroke="${spot.person.lead ? "#f8fafc" : "#60a5fa"}"></circle>
        ${name}
      </g>`;
    }).join("");
    const rings = Array.from({ length: ring }, (_, index) => orbitRing(sun.x, sun.y, 110 + index * 48, "#334155")).join("");
    const core = `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="#0c2340" stroke="#f8fafc"></circle>
      <text x="${sun.x}" y="${sun.y - 2}" text-anchor="middle" fill="#f8fafc" font-size="11">${esc(clip(title, 22))}</text>
      <text x="${sun.x}" y="${sun.y + 12}" text-anchor="middle" fill="#8ea0b8" font-size="10">${members.length} · ${esc(office)}</text>`;
    const outer = 110 + Math.max(0, ring - 1) * 48;
    return solarFrame(width, Math.max(height, outer * 2 + 80), title, rings + moons + core);
  }
  function officeSolar(office, members) {
    const teams = new Map();
    members.forEach((row) => {
      const label = row.team || "No public team";
      const list = teams.get(label) || [];
      list.push(row);
      teams.set(label, list);
    });
    const ordered = [...teams.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    if (ordered.length <= 1) return peopleSolar(office, office, members);
    const rings = [];
    let cursor = 0;
    let ring = 0;
    while (cursor < ordered.length) {
      const capacity = 10 + ring * 8;
      rings.push(ordered.slice(cursor, cursor + capacity));
      cursor += capacity;
      ring += 1;
    }
    const inner = 170;
    const gap = 112;
    const outer = inner + Math.max(0, rings.length - 1) * gap;
    const size = (outer + 80) * 2;
    const sun = { x: size / 2, y: size / 2, r: 50 };
    const moons = rings.map((slice, index) => {
      const radius = inner + index * gap;
      return orbitRing(sun.x, sun.y, radius, "#38bdf8") + slice.map(([team, teamRows], item) => {
        const spot = polar(sun.x, sun.y, radius, item, slice.length);
        spot.r = massRadius(teamRows.length);
        return planet(team, spot, teamRows.length, "#38bdf8", `data-team="${attr(team)}" role="button" tabindex="0"`, true, false);
      }).join("");
    }).join("");
    const core = planet(office, sun, members.length, "#f8fafc", "", true, true);
    return solarFrame(size, size, office, moons + core);
  }

  function drawOrbit() {
    const host = document.getElementById("orbit");
    const buckets = bucketsOf(orbitPeople);
    const { groups, elsewhere } = regionGroups(buckets);
    const regionStep = orbitTrail.find((step) => step.startsWith("region:"));
    const officeStep = orbitTrail.find((step) => step.startsWith("office:"));
    const teamStep = orbitTrail.find((step) => step.startsWith("team:"));
    const stepLabel = (step) => step.replace(/^(region|office|team):/, "");
    const crumbs = [`<button type="button" data-crumb="-1" class="${orbitTrail.length ? "" : "on"}">Palantir</button>`]
      .concat(orbitTrail.map((step, index) => `<button type="button" data-crumb="${index}" class="${index === orbitTrail.length - 1 ? "on" : ""}">${esc(stepLabel(step))}</button>`))
      .join("");
    let chart = "";
    let detail = "";
    if (officeStep && teamStep) {
      const office = officeStep.slice(7);
      const team = teamStep.slice(5);
      const members = (buckets.get(office) || []).filter((row) => (row.team || "No public team") === team);
      chart = peopleSolar(team, office, members);
    } else if (officeStep) {
      const office = officeStep.slice(7);
      chart = officeSolar(office, buckets.get(office) || []);
    } else if (regionStep) {
      const name = regionStep.slice(7);
      const region = GEO_REGIONS.find((item) => item[0] === name);
      const names = region ? regionNames(region, buckets, groups, false) : elsewhere;
      chart = regionSolar(name, region ? region[1] : "#94a3b8", names, buckets);
    } else {
      chart = companySolar(buckets, groups, elsewhere);
    }
    const withOffice = orbitPeople.filter((row) => row.office && row.office !== "Headquarters").length;
    host.innerHTML = `<p class="pyramid-note">${orbitPeople.length.toLocaleString()} LinkedIn profiles. A city without a listed office still sits in its region. A shared office is not a reporting line. ${withOffice.toLocaleString()} match a listed office.</p>
      <div class="crumb">${crumbs}</div>${chart}<div class="pyramid-detail" id="orbit-detail">${detail}</div>`;
  }

  document.getElementById("orbit").addEventListener("click", (event) => {
    const crumb = event.target.closest("[data-crumb]");
    if (crumb) {
      const index = Number(crumb.dataset.crumb);
      orbitTrail = index < 0 ? [] : orbitTrail.slice(0, index + 1);
      drawOrbit();
      return;
    }
    const geo = event.target.closest("[data-geo]");
    if (geo) {
      orbitTrail = ["region:" + geo.dataset.geo];
      drawOrbit();
      return;
    }
    const office = event.target.closest("[data-office]");
    if (office) {
      const name = office.dataset.office;
      const sample = orbitPeople.find((row) => bucketOf(row) === name);
      const region = regionFor(name, sample) || "Elsewhere";
      orbitTrail = ["region:" + region, "office:" + name];
      drawOrbit();
      return;
    }
    const team = event.target.closest("[data-team]");
    if (team) {
      const officeStep = orbitTrail.find((step) => step.startsWith("office:"));
      orbitTrail = orbitTrail.filter((step) => !step.startsWith("team:"));
      if (officeStep) orbitTrail.push("team:" + team.dataset.team);
      drawOrbit();
      return;
    }
    const person = event.target.closest("[data-person]");
    if (person) {
      const found = orbitPeople.find((row) => row.name === person.dataset.person);
      const box = document.getElementById("orbit-detail");
      if (box && found) box.textContent = found.name + (found.title ? " · " + found.title : "") + (found.office ? " · " + found.office : "");
    }
  });

  fetch("data/nc500.json").then((res) => res.json()).then((body) => {
    showRanking(body.people, body.headline);
  });
  fetch("data/palantir.json").then((res) => res.json()).then((body) => {
    orbitPeople = body.people || [];
    drawOrbit();
  });

  const shots = {
    region: ["assets/product/nc500.png", "The richest people in North Carolina", "NC 500"],
    company: ["assets/product/palantir-geo.png", "Palantir company map, location orbit", "Palantir"],
  };
  let group = "";
  let map = "";
  function paintNav() {
    document.querySelectorAll("[data-group]").forEach((button) => {
      const on = button.dataset.group === group;
      button.classList.toggle("on", on);
      button.setAttribute("aria-expanded", on ? "true" : "false");
    });
    document.querySelectorAll("[data-map]").forEach((link) => {
      link.hidden = link.dataset.map !== group;
      link.classList.toggle("on", link.dataset.map === map);
    });
    document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.id !== map; });
    const shot = shots[group || "region"];
    const img = document.querySelector("#hero-img");
    img.src = shot[0];
    img.alt = shot[1];
    document.querySelector("#hero-cap").textContent = shot[2];
  }
  document.querySelectorAll("[data-group]").forEach((button) => {
    button.addEventListener("click", () => {
      group = button.dataset.group;
      map = "";
      history.replaceState(null, "", "#top");
      paintNav();
    });
  });
  document.querySelectorAll("[data-map]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      group = link.dataset.map;
      map = link.dataset.map;
      history.replaceState(null, "", "#" + map);
      paintNav();
      document.getElementById(map).scrollIntoView({ block: "start" });
    });
  });
  document.querySelector("[data-home]").addEventListener("click", (event) => {
    event.preventDefault();
    group = "";
    map = "";
    history.replaceState(null, "", "#top");
    paintNav();
    window.scrollTo(0, 0);
  });
  if (location.hash === "#company" || location.hash === "#region") {
    group = location.hash.slice(1);
    map = group;
  }
  paintNav();
})();
