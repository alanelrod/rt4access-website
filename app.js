/* RT4Access desk.
   Billionaire figures: Forbes snapshot September 21, 2026.
   Slots 012–500 are an illustrative composition, not a wealth ranking.
*/
(function () {
  const METROS = [
    { id: "charlotte", label: "Charlotte", weight: 168, cities: ["Charlotte", "Huntersville", "Davidson", "Matthews", "Gastonia"], sectors: ["Real estate", "Finance", "Motorsports", "Retail", "Manufacturing", "Family office"] },
    { id: "triangle", label: "Triangle", weight: 154, cities: ["Raleigh", "Cary", "Durham", "Chapel Hill", "Apex"], sectors: ["Technology", "Life sciences", "Finance", "Real estate", "Family office"] },
    { id: "triad", label: "Triad", weight: 68, cities: ["Greensboro", "Winston-Salem", "High Point"], sectors: ["Manufacturing", "Real estate", "Textiles", "Family office", "Consumer"] },
    { id: "coast", label: "Coast", weight: 36, cities: ["Wilmington", "Wrightsville Beach", "Morehead City"], sectors: ["Life sciences", "Real estate", "Logistics", "Hospitality"] },
    { id: "mountains", label: "Mountains", weight: 28, cities: ["Asheville", "Hendersonville", "Boone"], sectors: ["Real estate", "Hospitality", "Manufacturing", "Family office"] },
    { id: "east", label: "East", weight: 35, cities: ["Greenville", "Fayetteville", "New Bern", "Rocky Mount"], sectors: ["Agriculture", "Manufacturing", "Logistics", "Distribution"] },
  ];

  const metroLabel = (id) => METROS.find((m) => m.id === id).label;

  function step(role, short, who, why) {
    return { role, short, who, why };
  }

  const billionaires = [
    {
      id: "goodnight",
      rank: 1,
      name: "James Goodnight",
      city: "Cary",
      metro: "triangle",
      sector: "Technology",
      source: "SAS Institute",
      worthLabel: "$10.9B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "NC State alumni", "NC State alumni in your client work", "SAS started on that campus in 1976."),
        step("Operator", "SAS customer", "An enterprise analytics lead at a SAS customer", "The product relationship is the warmest operator hop."),
        step("Capital", "Cary civic board", "A principal around Cary Academy or The Umstead", "Both are public Goodnight and Sall projects."),
        step("Door", "SAS principal", "A long-tenured principal on the Cary campus", "The person who can actually say your name."),
      ],
      why: "Cary is small once you are in the SAS orbit. The four people are a campus path: alumni, customer, civic board, then a principal who can make the introduction. John Sall is the same company.",
    },
    {
      id: "sall",
      rank: 2,
      name: "John Sall",
      city: "Cary",
      metro: "triangle",
      sector: "Technology",
      source: "SAS Institute",
      worthLabel: "$5.3B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "JMP or SAS user", "A JMP or SAS user in your portfolio", "Same tools, same campus."),
        step("Operator", "Cary product lead", "A product principal on the SAS campus", "A different building, the same company."),
        step("Capital", "Co-founder orbit", "A shared Cary board in the co-founder circle", "The academy, the hotel, and the company are one public graph."),
        step("Door", "Founder circle", "Someone who already works both founders", "A door to Sall is usually a door to Goodnight."),
      ],
      why: "John Sall co-founded SAS with James Goodnight and still sits on the same Cary campus. Map one founder and you are already in the other’s graph.",
    },
    {
      id: "sweeney",
      rank: 3,
      name: "Tim Sweeney",
      city: "Cary",
      metro: "triangle",
      sector: "Media",
      source: "Epic Games",
      worthLabel: "$4.2B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "Triangle gamedev", "A real-time or games engineer you know", "Epic’s orbit runs through Triangle talent."),
        step("Operator", "Unreal partner", "An Epic partner or Unreal licensee", "The operating edge of the company."),
        step("Capital", "Conservation circle", "Someone in his public conservation work", "Western North Carolina is part of the public record."),
        step("Door", "Cary bridge", "An operator between Epic and Cary’s civic graph", "Ranks 1, 2, and 3 live in the same town."),
      ],
      why: "Tim Sweeney is the third Cary seat, beside the two SAS founders. The town is the map. Games are the company.",
    },
    {
      id: "carroll",
      rank: 4,
      name: "Roy Carroll II",
      city: "Greensboro",
      metro: "triad",
      sector: "Real estate",
      source: "Carroll Companies",
      worthLabel: "$2.6B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "Triad tenant", "A Triad broker, tenant, or GC you know", "Start in Greensboro commercial real estate."),
        step("Operator", "Carroll operator", "A Carroll Companies property lead", "The day-to-day firm."),
        step("Capital", "Triad capital", "A local bank or family-office counsel", "Capital around the buildings."),
        step("Door", "Deal partner", "A developer who has built beside the firm", "The introduction comes from a deal, not a pitch."),
      ],
      why: "Roy Carroll II is the Triad’s public seat on this snapshot: Greensboro real estate, Carroll Companies. The path is a property path.",
    },
    {
      id: "gillings",
      rank: 5,
      name: "Dennis Gillings",
      city: "Durham",
      metro: "triangle",
      sector: "Life sciences",
      source: "IQVIA / Quintiles",
      worthLabel: "$2.4B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "RTP clinical", "A clinical-research operator in RTP", "Quintiles and IQVIA grew up here."),
        step("Operator", "Sponsor-side lead", "A sponsor or CRO principal", "The operating layer of trials."),
        step("Capital", "Durham board", "A Durham life-sciences board", "The university and the company sit close."),
        step("Door", "Founder circle", "A principal who has sat with that circle", "Use a real shared table."),
      ],
      why: "Dennis Gillings built Quintiles, now part of the IQVIA story, from the Triangle. Forbes lists the fortune beside Durham. The four people are a research-park path.",
    },
    {
      id: "harrison",
      rank: 6,
      name: "J. Frank Harrison III",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Food & beverage",
      source: "Coca-Cola Consolidated",
      worthLabel: "$1.9B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "Bottler system", "A retailer or brand operator in the system", "Coca-Cola Consolidated is the seat."),
        step("Operator", "Region lead", "A Consolidated region or plant lead", "The bottler runs across the Carolinas."),
        step("Capital", "Charlotte counsel", "Family-office counsel in Charlotte", "The capital hop."),
        step("Door", "Bottler director", "A director-level relationship inside the bottler", "The door is inside the company."),
      ],
      why: "J. Frank Harrison III is the largest public Charlotte seat on this snapshot, from the family bottler Coca-Cola Consolidated. Ric Elias is the other public Charlotte fortune.",
    },
    {
      id: "olivia",
      rank: 7,
      name: "Olivia Holding",
      city: "Raleigh",
      metro: "triangle",
      sector: "Finance",
      source: "First Citizens",
      worthLabel: "$1.7B",
      worthNote: "Forbes · Sept 21, 2026",
      path: holdingPath("Olivia Holding is the largest of the four First Citizens seats on this snapshot. One bank graph covers her, Carson Brice, Claire Bristow, and Frank Holding Jr."),
    },
    {
      id: "brice",
      rank: 8,
      name: "Carson Brice",
      city: "Raleigh",
      metro: "triangle",
      sector: "Finance",
      source: "First Citizens",
      worthLabel: "$1.5B",
      worthNote: "Forbes · Sept 21, 2026",
      path: holdingPath("Carson Brice is one of four First Citizens fortunes Forbes lists in Raleigh. The path does not change because the last name does."),
    },
    {
      id: "bristow",
      rank: 9,
      name: "Claire Bristow",
      city: "Raleigh",
      metro: "triangle",
      sector: "Finance",
      source: "First Citizens",
      worthLabel: "$1.5B",
      worthNote: "Forbes · Sept 21, 2026",
      path: holdingPath("Claire Bristow sits beside the other First Citizens seats. Map the shareholder circle once."),
    },
    {
      id: "frank",
      rank: 10,
      name: "Frank Holding Jr.",
      city: "Raleigh",
      metro: "triangle",
      sector: "Finance",
      source: "First Citizens",
      worthLabel: "$1.4B",
      worthNote: "Forbes · Sept 21, 2026",
      path: holdingPath("Frank Holding Jr. runs the bank. On this Forbes snapshot he is not the largest First Citizens seat — Olivia Holding is listed higher. Map the cluster, not the title."),
    },
    {
      id: "elias",
      rank: 11,
      name: "Ric Elias",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Media",
      source: "Red Ventures",
      worthLabel: "$1.0B",
      worthNote: "Forbes · Sept 21, 2026",
      path: [
        step("Warm start", "Charlotte growth", "A performance-marketing operator you know", "Start in the work, not the org chart."),
        step("Operator", "Portfolio lead", "A Red Ventures portfolio lead", "The operating edge of the firm."),
        step("Capital", "Growth investor", "A Charlotte investor in that orbit", "Capital that already speaks the language."),
        step("Door", "Partnership door", "A partnership principal who can walk you in", "The fourth person makes the introduction."),
      ],
      why: "Ric Elias is the other public Charlotte seat on this snapshot, from Red Ventures. Harrison is the bottler. The rest of Charlotte’s bench is locked.",
    },
  ];

  function holdingPath(why) {
    const path = [
      step("Warm start", "First Citizens", "A First Citizens banker you already use", "The warm start is a working bank relationship."),
      step("Operator", "Market principal", "A market or credit principal at the bank", "Day-to-day First Citizens."),
      step("Capital", "Raleigh office", "A Raleigh family office that banks in this circle", "Capital and the bank already share a table."),
      step("Door", "One family door", "One introduction into the shareholder circle", "Four of the eleven sit behind this door."),
    ];
    path.why = why;
    return path;
  }

  billionaires.forEach((b) => {
    if (!b.why && b.path.why) b.why = b.path.why;
    b.group = "public";
    b.hops = 4;
    b.rankLabel = `NC 500 · ${String(b.rank).padStart(2, "0")}`;
    b.metroLabel = metroLabel(b.metro);
  });

  function defaultPath(p) {
    return [
      step("Warm start", `${p.city} contact`, `Someone you already work with in ${p.city}`, "The path starts in your current book."),
      step("Operator", "Inside the company", `A day-to-day principal at ${p.source}`, "Operating companies are where introductions start."),
      step("Capital", `${p.metroLabel} capital`, `Counsel, a banker, or a family office in ${p.metroLabel}`, "The person in the meetings around the seat."),
      step("Door", "The introduction", `A peer who can say your name toward ${p.name}`, "The fourth person is the door, not another researcher."),
    ];
  }

  function principal(spec) {
    const p = {
      ...spec,
      group: "principal",
      hops: 4,
      worthLabel: "Private",
      worthNote: "No figure published here",
      rankLabel: "Public principal",
      metroLabel: metroLabel(spec.metro),
    };
    p.path = spec.path || defaultPath(p);
    p.why = spec.why || `${p.name} is a public principal in ${p.city}, tied to ${p.source}. This is not a wealth rank. The four people are the working distance: someone you know, someone in the operation, someone in the capital orbit, and someone who can make the introduction.`;
    return p;
  }

  const principals = [
    principal({
      id: "hendrick",
      name: "Rick Hendrick",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Automotive",
      source: "Hendrick Automotive",
      path: [
        step("Warm start", "Dealer contact", "A dealer or manufacturer contact you know", "Hendrick Automotive is one of the country’s largest private dealer groups."),
        step("Operator", "Store operator", "A general manager inside the group", "Retail is the wide door."),
        step("Capital", "Motorsports circle", "A Charlotte motorsports principal", "The racing graph and the dealer graph overlap."),
        step("Door", "Group door", "Someone who can introduce you at the group", "The fourth person is the introduction."),
      ],
      why: "Rick Hendrick sits in Charlotte between automotive retail and motorsports. He is not given a rank here. This Forbes snapshot of North Carolina billionaires does not include a figure we are willing to repeat. The path is still four roles.",
    }),
    principal({
      id: "eshelman",
      name: "Fred Eshelman",
      city: "Wilmington",
      metro: "coast",
      sector: "Life sciences",
      source: "PPD",
      why: "Fred Eshelman built PPD in Wilmington and gave the pharmacy school at UNC its name on the building. A real path can touch the coast and the Triangle. No net worth is stated here.",
    }),
    principal({
      id: "maynard",
      name: "James H. Maynard",
      city: "Raleigh",
      metro: "triangle",
      sector: "Restaurants",
      source: "Golden Corral",
      why: "James Maynard co-founded Golden Corral in Raleigh. The operating company is the path. He is listed without a rank and without a net worth.",
    }),
    principal({
      id: "levine",
      name: "Howard R. Levine",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Retail",
      source: "Family Dollar",
    }),
    principal({
      id: "pope",
      name: "Art Pope",
      city: "Raleigh",
      metro: "triangle",
      sector: "Retail",
      source: "Variety Wholesalers",
    }),
    principal({
      id: "kane",
      name: "John Kane",
      city: "Raleigh",
      metro: "triangle",
      sector: "Real estate",
      source: "Kane Realty",
    }),
    principal({
      id: "goodmon",
      name: "James F. Goodmon",
      city: "Raleigh",
      metro: "triangle",
      sector: "Media",
      source: "Capitol Broadcasting",
    }),
    principal({
      id: "msmith",
      name: "Marcus G. Smith",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Motorsports",
      source: "Speedway Motorsports",
    }),
    principal({
      id: "jharris",
      name: "Johnny Harris",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Real estate",
      source: "Lincoln Harris",
    }),
    principal({
      id: "sabates",
      name: "Felix Sabates",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Motorsports",
      source: "Motorsports & investments",
    }),
    principal({
      id: "childress",
      name: "Richard Childress",
      city: "Welcome",
      metro: "triad",
      sector: "Motorsports",
      source: "Richard Childress Racing",
    }),
    principal({
      id: "gibbs",
      name: "Joe Gibbs",
      city: "Huntersville",
      metro: "charlotte",
      sector: "Motorsports",
      source: "Joe Gibbs Racing",
    }),
    principal({
      id: "warlick",
      name: "Anderson Warlick",
      city: "Gastonia",
      metro: "charlotte",
      sector: "Manufacturing",
      source: "Parkdale Mills",
    }),
    principal({
      id: "kenan",
      name: "Thomas S. Kenan III",
      city: "Chapel Hill",
      metro: "triangle",
      sector: "Family office",
      source: "Kenan family",
    }),
    principal({
      id: "dowd",
      name: "Dowd family",
      city: "Charlotte",
      metro: "charlotte",
      sector: "Manufacturing",
      source: "Charlotte Pipe",
    }),
  ];

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rand) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildSlots() {
    const bag = [];
    METROS.forEach((m) => {
      for (let i = 0; i < m.weight; i++) bag.push(m);
    });
    return shuffle(bag, rng(500)).map((m, i) => {
      const rand = rng(1000 + i);
      const roll = rand();
      let hops = 4;
      if (roll < 0.05) hops = 2;
      else if (roll < 0.28) hops = 3;
      else if (roll < 0.8) hops = 4;
      else hops = 5;
      return {
        slot: i + 12,
        metro: m.id,
        metroLabel: m.label,
        city: m.cities[Math.floor(rand() * m.cities.length)],
        sector: m.sectors[Math.floor(rand() * m.sectors.length)],
        hops,
      };
    });
  }

  const slots = buildSlots();
  const byId = new Map();
  [...billionaires, ...principals].forEach((p) => byId.set(p.id, p));

  const totals = Object.fromEntries(METROS.map((m) => [m.id, 0]));
  billionaires.forEach((b) => { totals[b.metro] += 1; });
  slots.forEach((s) => { totals[s.metro] += 1; });

  const state = { metro: "all", sector: "all", hops: "all", q: "" };
  let active = billionaires[0];

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function initials(name) {
    const skip = /^(jr|sr|ii|iii|iv|family)$/i;
    const parts = name.split(/\s+/).map((p) => p.replace(/\./g, "")).filter((p) => p && !skip.test(p));
    const letters = parts.map((p) => p[0]).filter((ch) => /[a-z]/i.test(ch));
    if (!letters.length) return "NC";
    if (letters.length === 1) return letters[0].toUpperCase();
    return (letters[0] + letters[letters.length - 1]).toUpperCase();
  }

  function place(p) {
    if (p.city.toLowerCase() === String(p.metroLabel).toLowerCase()) return p.city;
    return `${p.city} · ${p.metroLabel}`;
  }

  function pad(n) {
    return String(n).padStart(3, "0");
  }

  function personFromSlot(slot) {
    const catalog = [
      step("Warm start", `${slot.city} contact`, `A ${slot.city} contact already in your work`, "Someone who will answer."),
      step("Operator", slot.sector, `A ${slot.sector.toLowerCase()} operator in ${slot.metroLabel}`, "The working layer around this seat."),
      step("Capital", "Local capital", `Counsel or a family office in ${slot.city}`, "Capital sits near the principal."),
      step("Bridge", "A second circle", `Another ${slot.metroLabel} principal in ${slot.sector.toLowerCase()}`, "Some seats take an extra circle."),
      step("Door", "The introduction", "The person who can make a named introduction", "The last person is the door."),
    ];
    const pick = {
      2: [0, 4],
      3: [0, 1, 4],
      4: [0, 1, 2, 4],
      5: [0, 1, 2, 3, 4],
    };
    return {
      id: `slot-${slot.slot}`,
      name: `Seat ${pad(slot.slot)}`,
      city: slot.city,
      metro: slot.metro,
      metroLabel: slot.metroLabel,
      sector: slot.sector,
      source: slot.sector,
      worthLabel: "Locked",
      worthNote: "Name unlocks with access",
      rankLabel: `Slot ${pad(slot.slot)}`,
      group: "slot",
      hops: slot.hops,
      path: pick[slot.hops].map((idx) => catalog[idx]),
      why: `Seat ${pad(slot.slot)} is a locked ${slot.sector.toLowerCase()} principal in ${slot.city}. The desk model puts this seat ${slot.hops} ${slot.hops === 1 ? "person" : "people"} away. The roles are how a path gets worked once the name is open. Slot order is not a wealth rank.`,
    };
  }

  function stepsHtml(person, mode) {
    return person.path.map((s, i) => `
      <li>
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <span class="role">${esc(s.role)}</span>
        <strong>${esc(mode === "stage" ? s.short : s.who)}</strong>
        ${mode === "detail" ? `<span class="why">${esc(s.why)}</span>` : ""}
      </li>
    `).join("");
  }

  function targetHtml(person) {
    const priv = person.worthLabel === "Locked" || person.worthLabel === "Private";
    return `
      <div class="mark" aria-hidden="true">${esc(initials(person.name))}</div>
      <div>
        <span class="role">${esc(person.rankLabel)}</span>
        <h3>${esc(person.name)}</h3>
        <p class="meta">${esc(place(person))} · ${esc(person.source)}</p>
      </div>
      <div class="worth${priv ? " is-private" : ""}">
        <strong>${esc(person.worthLabel)}</strong>
        <span>${esc(person.worthNote)}</span>
      </div>
    `;
  }

  function renderActive() {
    const away = `${active.path.length} ${active.path.length === 1 ? "person" : "people"} away`;
    const selBox = document.getElementById("map-selection");
    if (selBox) {
      selBox.innerHTML = `
        <p class="map-kicker">Selection</p>
        <h3>${esc(active.name)}</h3>
        <p>${esc(place(active))}${active.source ? ` · ${esc(active.source)}` : ""}</p>
        <p>${esc(away)}</p>
        <ol>${active.path.map((s) => `<li><span>${esc(s.role)}</span>${esc(s.short)}</li>`).join("")}</ol>
      `;
    }
    if (typeof paintActive === "function") paintActive();
    document.getElementById("detail-steps").innerHTML = stepsHtml(active, "detail");
    document.getElementById("detail-target").innerHTML = targetHtml(active);
    document.getElementById("detail-why").textContent = active.why;
    const sel = document.getElementById("seat");
    if (!sel) return;
    if (active.group === "slot") {
      let opt = sel.querySelector(`option[value="${active.id}"]`);
      if (!opt) {
        opt = document.createElement("option");
        opt.value = active.id;
        sel.appendChild(opt);
      }
      opt.textContent = `${active.name} · ${active.city} · ${active.sector}`;
    }
    if ([...sel.options].some((o) => o.value === active.id)) sel.value = active.id;
  }

  function renderBillionaires() {
    document.getElementById("billionaire-body").innerHTML = billionaires.map((b) => `
      <tr>
        <td class="num">${String(b.rank).padStart(2, "0")}</td>
        <td><strong>${esc(b.name)}</strong></td>
        <td>${esc(place(b))}</td>
        <td>${esc(b.source)}</td>
        <td class="money">${esc(b.worthLabel)}</td>
        <td><button type="button" class="text-btn" data-target="${b.id}" data-scroll>Map the four</button></td>
      </tr>
    `).join("");
  }

  function renderPrincipals() {
    document.getElementById("principal-grid").innerHTML = principals.map((p) => `
      <button type="button" class="principal" data-target="${p.id}" data-scroll>
        <strong>${esc(p.name)}</strong>
        <span>${esc(place(p))} · ${esc(p.source)}</span>
        <em>Map the four</em>
      </button>
    `).join("");
  }

  function hopTally() {
    const counts = { 2: 0, 3: 0, 4: 0, 5: 0 };
    slots.forEach((s) => { counts[s.hops] += 1; });
    counts[4] += billionaires.length;
    return counts;
  }

  function renderMix() {
    const counts = hopTally();
    const max = Math.max(...Object.values(counts));
    const rows = [2, 3, 4, 5].map((n) => `
      <div class="mix-row${n === 4 ? " is-focus" : ""}">
        <span>${n} ${n === 1 ? "person" : "people"}</span>
        <span class="bar"><span style="width:${Math.round((counts[n] / max) * 100)}%"></span></span>
        <b>${counts[n]}</b>
      </div>
    `).join("");
    document.getElementById("hop-mix").innerHTML = `
      <p>${counts[4]} of 500 sit four people away in this desk model. The 11 public billionaires are counted at 4. Locked slots run from 2 to 5. This is not a surveyed social graph.</p>
      ${rows}
    `;
  }

  const CITY = {
    Cary: [35.791, -78.781],
    Raleigh: [35.779, -78.638],
    Durham: [35.994, -78.899],
    "Chapel Hill": [35.913, -79.056],
    Apex: [35.732, -78.851],
    Charlotte: [35.227, -80.843],
    Huntersville: [35.411, -80.843],
    Davidson: [35.499, -80.848],
    Matthews: [35.117, -80.723],
    Gastonia: [35.262, -81.187],
    Greensboro: [36.073, -79.792],
    "Winston-Salem": [36.099, -80.244],
    "High Point": [35.956, -80.005],
    Wilmington: [34.226, -77.945],
    "Wrightsville Beach": [34.208, -77.796],
    "Morehead City": [34.723, -76.726],
    Asheville: [35.595, -82.551],
    Hendersonville: [35.318, -82.461],
    Boone: [36.217, -81.675],
    Greenville: [35.613, -77.366],
    Fayetteville: [35.053, -78.878],
    "New Bern": [35.108, -77.044],
    "Rocky Mount": [35.938, -77.791],
    Welcome: [35.902, -80.254],
  };

  const SEAT = {
    goodnight: [35.824, -78.762],
    sall: [35.812, -78.748],
    sweeney: [35.791, -78.781],
    carroll: [36.073, -79.792],
    gillings: [35.905, -78.868],
    harrison: [35.227, -80.843],
    olivia: [35.775, -78.639],
    brice: [35.782, -78.642],
    bristow: [35.771, -78.648],
    frank: [35.778, -78.636],
    elias: [35.214, -80.830],
    hendrick: [35.242, -80.812],
    eshelman: [34.226, -77.945],
    maynard: [35.790, -78.655],
    levine: [35.214, -80.860],
    pope: [35.804, -78.670],
    kane: [35.812, -78.682],
    goodmon: [35.768, -78.644],
    msmith: [35.330, -80.850],
    jharris: [35.210, -80.860],
    sabates: [35.240, -80.820],
    childress: [35.902, -80.254],
    gibbs: [35.411, -80.843],
    warlick: [35.262, -81.187],
    kenan: [35.913, -79.056],
    dowd: [35.200, -80.870],
  };

  let marketMap = null;
  let layerPublic = null;
  let layerLocked = null;
  let picture = "nc";
  const markers = new Map();

  function paintActive() {
    markers.forEach((marker, id) => {
      const on = id === active.id;
      marker.setStyle({
        weight: on ? 3 : 1,
        color: on ? "#4c1d95" : "#5b21b6",
        radius: marker.options.big ? (on ? 9 : 7) : 3.5,
      });
      if (on) marker.bringToFront();
    });
  }

  function showPicture(id) {
    picture = id === "rtp" ? "rtp" : "nc";
    document.querySelectorAll("[data-picture]").forEach((btn) => {
      if (btn.tagName === "BUTTON") btn.setAttribute("aria-pressed", btn.dataset.picture === picture ? "true" : "false");
    });
    const base = document.getElementById("map-base");
    if (base) base.textContent = picture === "rtp" ? "RTP · Triangle" : "NC 500 · statewide";
    if (!marketMap) return;
    const bounds = picture === "rtp"
      ? [[35.68, -79.16], [36.08, -78.48]]
      : [[33.84, -84.35], [36.59, -75.46]];
    const narrow = window.matchMedia("(max-width: 980px)").matches;
    marketMap.invalidateSize();
    marketMap.fitBounds(bounds, {
      paddingTopLeft: narrow ? [12, 12] : [196, 64],
      paddingBottomRight: narrow ? [12, 12] : [220, 28],
    });
  }

  function renderMap() {
    const maxBar = Math.max(...Object.values(totals));
    document.getElementById("metro-bars").innerHTML = METROS.map((m) => `
      <button type="button" data-metro="${m.id}">
        <span>${m.label}</span>
        <span class="bar"><span style="width:${Math.round((totals[m.id] / maxBar) * 100)}%"></span></span>
        <span class="count">${totals[m.id]}</span>
      </button>
    `).join("");

    if (typeof L === "undefined") {
      document.getElementById("market-map").textContent = "Map tiles did not load.";
      return;
    }

    marketMap = L.map("market-map", { zoomControl: false, scrollWheelZoom: false });
    L.control.zoom({ position: "bottomleft" }).addTo(marketMap);
    const tileOpts = { maxZoom: 16, attribution: "Tiles &copy; Esri" };
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", tileOpts).addTo(marketMap);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 }).addTo(marketMap);
    layerPublic = L.layerGroup().addTo(marketMap);
    layerLocked = L.layerGroup().addTo(marketMap);

    function addPin(person, latlng, big) {
      const marker = L.circleMarker(latlng, {
        radius: big ? 7 : 3.5,
        color: "#5b21b6",
        weight: 1,
        fillColor: big ? "#7c3aed" : "#c4b5fd",
        fillOpacity: 0.92,
        big,
      });
      marker.bindTooltip(person.name, { direction: "top", opacity: 0.95 });
      marker.on("click", () => setPerson(person));
      marker.addTo(big ? layerPublic : layerLocked);
      markers.set(person.id, marker);
    }

    [...billionaires, ...principals].forEach((person) => {
      const at = SEAT[person.id] || CITY[person.city];
      if (at) addPin(person, at, true);
    });

    slots.forEach((slot) => {
      const at = CITY[slot.city];
      if (!at) return;
      const rand = rng(slot.slot * 17);
      const lat = at[0] + (rand() - 0.5) * 0.12;
      const lon = at[1] + (rand() - 0.5) * 0.12;
      addPin(personFromSlot(slot), [lat, lon], false);
    });

    document.getElementById("layer-public").addEventListener("change", (event) => {
      if (event.target.checked) layerPublic.addTo(marketMap);
      else marketMap.removeLayer(layerPublic);
    });
    document.getElementById("layer-locked").addEventListener("change", (event) => {
      if (event.target.checked) layerLocked.addTo(marketMap);
      else marketMap.removeLayer(layerLocked);
    });

    showPicture("nc");
    paintActive();
  }

  function renderChips() {
    const metros = [{ id: "all", label: "All NC" }].concat(METROS.map((m) => ({ id: m.id, label: m.label })));
    document.getElementById("metro-chips").innerHTML = metros.map((m) => `
      <button type="button" data-metro="${m.id}" aria-pressed="${m.id === "all"}">${m.label}</button>
    `).join("");
    const hops = [
      ["all", "Any distance"],
      ["4", "4 people"],
      ["3", "3"],
      ["2", "2"],
      ["5", "5"],
    ];
    document.getElementById("hop-chips").innerHTML = hops.map(([id, label]) => `
      <button type="button" data-hops="${id}" aria-pressed="${id === "all"}">${label}</button>
    `).join("");
    const sectors = [...new Set(
      [...billionaires, ...principals, ...slots].map((p) => p.sector)
    )].sort();
    const select = document.getElementById("sector");
    sectors.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
  }

  function fillSeatSelect() {
    const sel = document.getElementById("seat");
    const pub = document.createElement("optgroup");
    pub.label = "Public billionaires";
    billionaires.forEach((b) => {
      const o = document.createElement("option");
      o.value = b.id;
      o.textContent = `${String(b.rank).padStart(2, "0")} · ${b.name}`;
      pub.appendChild(o);
    });
    const pri = document.createElement("optgroup");
    pri.label = "Public principals";
    principals.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name;
      pri.appendChild(o);
    });
    sel.append(pub, pri);
    sel.value = active.id;
  }

  function qMatch(person) {
    if (!state.q) return true;
    const q = state.q.replace(/\bslot\b/g, " ").replace(/\s+/g, " ").trim();
    if (!q) return true;
    const hay = `${person.name || ""} ${person.city} ${person.source || ""} ${person.sector} ${person.metroLabel} ${person.slot || ""} ${person.rank || ""}`.toLowerCase();
    return q.split(" ").every((part) => hay.includes(part));
  }

  function metroOk(metro) {
    return state.metro === "all" || metro === state.metro;
  }

  function renderDesk() {
    const filtering = state.metro !== "all" || state.sector !== "all" || state.hops !== "all" || state.q.length > 0;
    const named = [...billionaires, ...principals].filter((p) => {
      if (!metroOk(p.metro)) return false;
      if (state.sector !== "all" && p.sector !== state.sector) return false;
      if (state.hops !== "all" && String(p.hops) !== state.hops) return false;
      return qMatch(p);
    });
    const shown = slots.filter((s) => {
      if (!metroOk(s.metro)) return false;
      if (state.sector !== "all" && s.sector !== state.sector) return false;
      if (state.hops !== "all" && String(s.hops) !== state.hops) return false;
      return qMatch(s);
    });

    document.querySelectorAll("[data-metro]").forEach((el) => {
      const on = el.dataset.metro === state.metro;
      el.classList.toggle("is-on", on);
      if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll("[data-hops]").forEach((el) => {
      el.setAttribute("aria-pressed", el.dataset.hops === state.hops ? "true" : "false");
    });

    const namedEl = document.getElementById("named-matches");
    if (!filtering || !named.length) {
      namedEl.innerHTML = "";
    } else {
      namedEl.innerHTML = named.map((p) => `
        <button type="button" data-target="${p.id}" data-scroll>${esc(p.name)}</button>
      `).join("");
    }

    const metroName = state.metro === "all" ? "North Carolina" : metroLabel(state.metro);
    const pubHere = billionaires.filter((b) => metroOk(b.metro)).length;
    document.getElementById("result-count").textContent = filtering
      ? `${shown.length} locked seats in this cut · ${named.length} named ${named.length === 1 ? "match" : "matches"}`
      : `${shown.length} locked seats across ${metroName} · ${pubHere} public billionaires on the index`;

    const list = document.getElementById("slot-list");
    if (!shown.length) {
      list.innerHTML = `<p class="empty">No locked seats in this cut. Clear a filter or search a named person.</p>`;
      return;
    }
    list.innerHTML = shown.map((s) => `
      <button type="button" class="slot" data-slot="${s.slot}">
        <span class="idx">${pad(s.slot)}</span>
        <span>${esc(s.city)} · ${esc(s.metroLabel)}</span>
        <span class="sector">${esc(s.sector)}</span>
        <span class="away">${s.hops}</span>
      </button>
    `).join("");
  }

  function setPerson(person, opts) {
    active = person;
    renderActive();
    if (opts && opts.scroll) {
      document.getElementById("four").scrollIntoView({ behavior: "smooth" });
    }
  }

  document.body.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const metro = event.target.closest && event.target.closest("#metro-bars [data-metro]");
    if (!metro) return;
    event.preventDefault();
    metro.click();
  });

  document.body.addEventListener("click", (event) => {
    const picBtn = event.target.closest("[data-picture]");
    if (picBtn) {
      showPicture(picBtn.dataset.picture);
      if (picBtn.hasAttribute("data-scroll")) {
        document.getElementById("stage").scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    const slotBtn = event.target.closest("[data-slot]");
    if (slotBtn) {
      const slot = slots.find((s) => s.slot === Number(slotBtn.dataset.slot));
      if (slot) setPerson(personFromSlot(slot), { scroll: true });
      return;
    }
    const hopsBtn = event.target.closest("[data-hops]");
    if (hopsBtn) {
      state.hops = hopsBtn.dataset.hops;
      renderDesk();
      return;
    }
    const metroBtn = event.target.closest("[data-metro]");
    if (metroBtn) {
      const id = metroBtn.dataset.metro;
      state.metro = state.metro === id ? "all" : id;
      renderDesk();
      if (metroBtn.hasAttribute("data-scroll")) {
        document.getElementById("desk").scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    const targetBtn = event.target.closest("[data-target]");
    if (targetBtn) {
      const person = byId.get(targetBtn.dataset.target);
      if (person) setPerson(person, { scroll: targetBtn.hasAttribute("data-scroll") });
    }
  });

  document.getElementById("q").addEventListener("input", (event) => {
    state.q = event.target.value.trim().toLowerCase();
    renderDesk();
  });
  document.getElementById("sector").addEventListener("change", (event) => {
    state.sector = event.target.value;
    renderDesk();
  });
  document.getElementById("seat").addEventListener("change", (event) => {
    const person = byId.get(event.target.value) || (active.id === event.target.value ? active : null);
    if (person) setPerson(person);
  });

  const form = document.getElementById("walkthrough");
  const held = document.getElementById("held");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const person = byId.get(data.get("seat")) || (active && active.id === data.get("seat") ? active : null);
    form.hidden = true;
    held.hidden = false;
    held.replaceChildren();
    const h = document.createElement("h3");
    h.textContent = `Held for ${data.get("name").trim()}.`;
    const p = document.createElement("p");
    const seatName = person ? person.name : "that seat";
    const hops = person ? person.path.length : 4;
    p.textContent = `${data.get("firm").trim()} · ${data.get("base")}. The walkthrough is the ${hops} ${hops === 1 ? "person" : "people"} between you and ${seatName}. Nothing was sent. This desk stays in the browser.`;
    const note = data.get("note").trim();
    const p2 = document.createElement("p");
    p2.textContent = note ? `Warm start noted: ${note}` : "No warm start noted yet. The first person on the path is still open.";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = "Edit the request";
    btn.addEventListener("click", () => {
      held.hidden = true;
      form.hidden = false;
    });
    held.append(h, p, p2, btn);
  });

  const indexSum = billionaires.length + slots.length;
  renderBillionaires();
  renderPrincipals();
  renderMix();
  renderMap();
  renderChips();
  fillSeatSelect();
  renderActive();
  renderDesk();
  if (indexSum !== 500 || slots.length !== 489) {
    document.getElementById("result-count").textContent = `Index error: ${indexSum} seats.`;
  }
})();
