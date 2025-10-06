import express from "express";
import fetch from "node-fetch";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,          // force SSL
    rejectUnauthorized: false // allow self-signed cert
  }
});
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL database");
    client.release();
  })
  .catch(err => console.error("❌ Database connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Replace with your full dump values
const customData = {
  name: "PiyushJoshi",
  "group": "admin",
  "shortId": "ll5natt6",
  levelInfo: {"id": 19},
  equipped:{
    "profile.avatar": [{id: "char_droid_01_skin_0002" }],
    "vehicle.veh_bike_01":[{"id": "veh_bike_01_skin_0053" }],
    trails:[{"id": "trl_0064" }],
    "slotwheel_slot_0001": [{"id": "emt_0048"}],
    "slotwheel_slot_0002": [{"id": "emt_0017"}],
    "slotwheel_slot_0003": [{"id": "emt_0057"}],
    "slotwheel_slot_0004": [{"id": "emt_0061"}],
    "slotwheel_slot_0005": [{"id": "emt_0062"}],
    "slotwheel_slot_0006": [{"id": "emt_0065"}],
    "slotwheel_slot_0007": [{"id": "emt_0095"}],
    "slotwheel_slot_0008": [{"id": "emt_0041"}],
    "slotwheel_slot_0009": [{"id": "stk_0041"}],
    "weapon.gun_mle_01": [{"id": "gun_mle_01_skin_0002" }],
    "weapon.gun_sg_01": [{"id": "gun_sg_01_skin_0019" }],
    "weapon.gun_sg_02": [{"id": "gun_sg_02_skin_0007" }],
    "weapon.gun_hg_01": [{"id": "gun_hg_01_skin_0008" }],
    "weapon.gun_hg_02": [{"id": "gun_hg_02_skin_0005" }],
    "weapon.gun_smg_01": [{"id": "gun_smg_01_skin_0006" }],
    "weapon.gun_smg_02": [{"id": "gun_smg_02_skin_0007" }],
    "weapon.gun_ar_01": [{"id": "gun_ar_01_skin_0010" }],
    "weapon.gun_ar_02": [{"id": "gun_ar_02_skin_0005" }],
    "weapon.gun_ar_03": [{"id": "gun_ar_03_skin_0001" }],
    "weapon.gun_lmg_01": [{"id": "gun_lmg_01_skin_0013" }],
    "weapon.gun_lmg_02": [{"id": "gun_lmg_02_skin_0002" }],
    "weapon.gun_sr_01": [{"id": "gun_sr_01_skin_0009" }],
    "weapon.gun_sr_02": [{"id": "gun_sr_02_skin_0004" }]
  },

  owned: {
    "profile.avatar": [
      { id: "char_droid_01_skin_0000" }, { id: "char_droid_01_skin_0001" }, { id: "char_droid_01_skin_0002" }, { id: "char_droid_02_skin_0000" }, { id: "char_droid_03_skin_0000" }, { id: "char_female_01_skin_0004" }, { id: "char_female_01_skin_0005" }, { id: "char_female_01_skin_0006" }, { id: "char_female_01_skin_0007" }, { id: "char_female_01_skin_0008" }, { id: "char_female_01_skin_0009" }, { id: "char_female_01_skin_0010" }, { id: "char_female_02_skin_0000" }, { id: "char_female_03_skin_0004" }, { id: "char_female_03_skin_0005" }, { id: "char_female_03_skin_0006" }, { id: "char_female_03_skin_0007" }, { id: "char_female_03_skin_0008" }, { id: "char_female_03_skin_0009" }, { id: "char_female_03_skin_0011" }, { id: "char_female_03_skin_0012" }, { id: "char_female_04_skin_0000" }, { id: "char_female_05_skin_0000" }, { id: "char_female_06_skin_0000" }, { id: "char_female_06_skin_0001" }, { id: "char_female_06_skin_0002" }, { id: "char_female_07_skin_0000" }, { id: "char_female_08_skin_0000" }, { id: "char_male_01_skin_0004" }, { id: "char_male_01_skin_0005" }, { id: "char_male_01_skin_0006" }, { id: "char_male_01_skin_0007" }, { id: "char_male_01_skin_0008" }, { id: "char_male_01_skin_0009" }, { id: "char_male_01_skin_0010" }, { id: "char_male_01_skin_0011" }, { id: "char_male_01_skin_0012" }, { id: "char_male_01_skin_0013" }, { id: "char_male_02_skin_0000" }, { id: "char_male_03_skin_0002" }, { id: "char_male_03_skin_0003" }, { id: "char_male_03_skin_0004" }, { id: "char_male_03_skin_0005" }, { id: "char_male_03_skin_0006" }, { id: "char_male_03_skin_0007" }, { id: "char_male_03_skin_0008" }, { id: "char_male_03_skin_0009" }, { id: "char_male_04_skin_0000" }, { id: "char_male_05_skin_0000" }, { id: "char_male_05_skin_0001" }, { id: "char_male_06_skin_0000" }, { id: "char_male_06_skin_0001" }, { id: "char_male_06_skin_0002" }, { id: "char_male_06_skin_0003" }, { id: "char_male_07_skin_0000" }, { id: "char_male_07_skin_0001" }, { id: "char_male_07_skin_0002" }, { id: "char_male_07_skin_0003" }, { id: "char_male_08_skin_0000" }, { id: "char_male_08_skin_0001" }, { id: "char_male_09_skin_0000" }, { id: "char_male_09_skin_0001" }, { id: "char_male_09_skin_0002" }, { id: "char_male_10_skin_0000" }, { id: "char_male_11_skin_0000" }
    ],
    trails: [
      { id: "trl_0001" }, { id: "trl_0002" }, { id: "trl_0003" }, { id: "trl_0004" }, { id: "trl_0005" }, { id: "trl_0020" }, { id: "trl_0021" }, { id: "trl_0022" }, { id: "trl_0023" }, { id: "trl_0024" }, { id: "trl_0025" }, { id: "trl_0026" }, { id: "trl_0027" }, { id: "trl_0028" }, { id: "trl_0029" }, { id: "trl_0030" }, { id: "trl_0031" }, { id: "trl_0032" }, { id: "trl_0033" }, { id: "trl_0034" }, { id: "trl_0035" }, { id: "trl_0036" }, { id: "trl_0037" }, { id: "trl_0038" }, { id: "trl_0039" }, { id: "trl_0040" }, { id: "trl_0041" }, { id: "trl_0042" }, { id: "trl_0043" }, { id: "trl_0044" }, { id: "trl_0045" }, { id: "trl_0046" }, { id: "trl_0047" }, { id: "trl_0048" }, { id: "trl_0049" }, { id: "trl_0050" }, { id: "trl_0051" }, { id: "trl_0052" }, { id: "trl_0053" }, { id: "trl_0054" }, { id: "trl_0055" }, { id: "trl_0056" }, { id: "trl_0057" }, { id: "trl_0058" }, { id: "trl_0059" }, { id: "trl_0060" }, { id: "trl_0061" }, { id: "trl_0062" }, { id: "trl_0063" }, { id: "trl_0064" }, { id: "trl_0065" }
    ],
    emotes: [
     { id: "emt_0001" }, { id: "emt_0002" }, { id: "emt_0003" }, { id: "emt_0004" }, { id: "emt_0005" }, { id: "emt_0006" }, { id: "emt_0007" }, { id: "emt_0008" }, { id: "emt_0009" }, { id: "emt_0010" }, { id: "emt_0011" }, { id: "emt_0012" }, { id: "emt_0013" }, { id: "emt_0014" }, { id: "emt_0015" }, { id: "emt_0016" }, { id: "emt_0017" }, { id: "emt_0018" }, { id: "emt_0019" }, { id: "emt_0020" }, { id: "emt_0021" }, { id: "emt_0022" }, { id: "emt_0023" }, { id: "emt_0024" }, { id: "emt_0025" }, { id: "emt_0026" }, { id: "emt_0027" }, { id: "emt_0028" }, { id: "emt_0029" }, { id: "emt_0030" }, { id: "emt_0031" }, { id: "emt_0032" }, { id: "emt_0033" }, { id: "emt_0034" }, { id: "emt_0035" }, { id: "emt_0036" }, { id: "emt_0037" }, { id: "emt_0038" }, { id: "emt_0039" }, { id: "emt_0040" }, { id: "emt_0041" }, { id: "emt_0042" }, { id: "emt_0043" }, { id: "emt_0044" }, { id: "emt_0045" }, { id: "emt_0046" }, { id: "emt_0047" }, { id: "emt_0048" }, { id: "emt_0049" }, { id: "emt_0050" }, { id: "emt_0051" }, { id: "emt_0052" }, { id: "emt_0053" }, { id: "emt_0054" }, { id: "emt_0055" }, { id: "emt_0056" }, { id: "emt_0057" }, { id: "emt_0058" }, { id: "emt_0059" }, { id: "emt_0060" }, { id: "emt_0061" }, { id: "emt_0062" }, { id: "emt_0063" }, { id: "emt_0064" }, { id: "emt_0065" }, { id: "emt_0066" }, { id: "emt_0067" }, { id: "emt_0068" }, { id: "emt_0069" }, { id: "emt_0070" }, { id: "emt_0071" }, { id: "emt_0072" }, { id: "emt_0073" }, { id: "emt_0074" }, { id: "emt_0075" }, { id: "emt_0076" }, { id: "emt_0077" }, { id: "emt_0078" }, { id: "emt_0079" }, { id: "emt_0080" }, { id: "emt_0081" }, { id: "emt_0082" }, { id: "emt_0083" }, { id: "emt_0084" }, { id: "emt_0085" }, { id: "emt_0086" }, { id: "emt_0087" }, { id: "emt_0088" }, { id: "emt_0089" }, { id: "emt_0090" }, { id: "emt_0091" }, { id: "emt_0092" }, { id: "emt_0093" }, { id: "emt_0094" }, { id: "emt_0095" }, { id: "emt_0096" }, { id: "emt_0097" }, { id: "emt_0098" }, { id: "emt_0099" }, { id: "emt_0100" }, { id: "emt_0101" }, { id: "emt_0102" }, { id: "emt_0103" }
    ],
    "weapon.gun_ar_01": [
        "gun_ar_01_skin_0000",
        "gun_ar_01_skin_0001",
        "gun_ar_01_skin_0002",
        "gun_ar_01_skin_0003",
        "gun_ar_01_skin_0004",
        "gun_ar_01_skin_0005",
        "gun_ar_01_skin_0006",
        "gun_ar_01_skin_0007",
        "gun_ar_01_skin_0008",
        "gun_ar_01_skin_0009",
        "gun_ar_01_skin_0010",
        "gun_ar_01_skin_0011",
        "gun_ar_01_skin_0012",
        "gun_ar_01_skin_0013",
        "gun_ar_01_skin_0014",
        "gun_ar_01_skin_0015",
        "gun_ar_01_skin_0016",
        "gun_ar_01_skin_0017",
        "gun_ar_01_skin_0018",
        "gun_ar_01_skin_0019"
    ],
    "weapon.gun_ar_02": [
        "gun_ar_02_skin_0000",
        "gun_ar_02_skin_0001",
        "gun_ar_02_skin_0002",
        "gun_ar_02_skin_0003",
        "gun_ar_02_skin_0004",
        "gun_ar_02_skin_0005",
        "gun_ar_02_skin_0006",
        "gun_ar_02_skin_0007",
        "gun_ar_02_skin_0008",
        "gun_ar_02_skin_0009"
    ],
    "weapon.gun_ar_03": [
        "gun_ar_03_skin_0000",
        "gun_ar_03_skin_0001"
    ],
    "weapon.gun_smg_01": [
        "gun_smg_01_skin_0000",
        "gun_smg_01_skin_0001",
        "gun_smg_01_skin_0002",
        "gun_smg_01_skin_0003",
        "gun_smg_01_skin_0004",
        "gun_smg_01_skin_0005",
        "gun_smg_01_skin_0006",
        "gun_smg_01_skin_0007",
        "gun_smg_01_skin_0008",
        "gun_smg_01_skin_0009",
        "gun_smg_01_skin_0010",
        "gun_smg_01_skin_0011",
        "gun_smg_01_skin_0012",
        "gun_smg_01_skin_0013",
        "gun_smg_01_skin_0014",
        "gun_smg_01_skin_0015",
        "gun_smg_01_skin_0016",
        "gun_smg_01_skin_0017",
        "gun_smg_01_skin_0018",
        "gun_smg_01_skin_0019",
        "gun_smg_01_skin_0020",
        "gun_smg_01_skin_0021",
        "gun_smg_01_skin_0022"
    ],
    "weapon.gun_smg_02": [
        "gun_smg_02_skin_0000",
        "gun_smg_02_skin_0001",
        "gun_smg_02_skin_0002",
        "gun_smg_02_skin_0003",
        "gun_smg_02_skin_0004",
        "gun_smg_02_skin_0005",
        "gun_smg_02_skin_0006",
        "gun_smg_02_skin_0007",
        "gun_smg_02_skin_0008",
        "gun_smg_02_skin_0009",
        "gun_smg_02_skin_0010",
        "gun_smg_02_skin_0011",
        "gun_smg_02_skin_0012"
    ],
    "weapon.gun_sg_01": [
        "gun_sg_01_skin_0000",
        "gun_sg_01_skin_0001",
        "gun_sg_01_skin_0002",
        "gun_sg_01_skin_0003",
        "gun_sg_01_skin_0004",
        "gun_sg_01_skin_0005",
        "gun_sg_01_skin_0006",
        "gun_sg_01_skin_0007",
        "gun_sg_01_skin_0008",
        "gun_sg_01_skin_0009",
        "gun_sg_01_skin_0010",
        "gun_sg_01_skin_0011",
        "gun_sg_01_skin_0012",
        "gun_sg_01_skin_0013",
        "gun_sg_01_skin_0014",
        "gun_sg_01_skin_0015",
        "gun_sg_01_skin_0016",
        "gun_sg_01_skin_0017",
        "gun_sg_01_skin_0018",
        "gun_sg_01_skin_0019",
        "gun_sg_01_skin_0020",
        "gun_sg_01_skin_0021",
        "gun_sg_01_skin_0022"
    ],
    "weapon.gun_lmg_01": [
        "gun_lmg_01_skin_0000",
        "gun_lmg_01_skin_0001",
        "gun_lmg_01_skin_0002",
        "gun_lmg_01_skin_0003",
        "gun_lmg_01_skin_0004",
        "gun_lmg_01_skin_0005",
        "gun_lmg_01_skin_0006",
        "gun_lmg_01_skin_0007",
        "gun_lmg_01_skin_0008",
        "gun_lmg_01_skin_0009",
        "gun_lmg_01_skin_0011",
        "gun_lmg_01_skin_0012",
        "gun_lmg_01_skin_0013",
        "gun_lmg_01_skin_0014",
        "gun_lmg_01_skin_0015"
    ],
    "weapon.gun_hg_01": [
        "gun_hg_01_skin_0000",
        "gun_hg_01_skin_0001",
        "gun_hg_01_skin_0002",
        "gun_hg_01_skin_0003",
        "gun_hg_01_skin_0004",
        "gun_hg_01_skin_0005",
        "gun_hg_01_skin_0006",
        "gun_hg_01_skin_0007",
        "gun_hg_01_skin_0008",
        "gun_hg_01_skin_0009"
    ],
    "weapon.gun_sr_01": [
        "gun_sr_01_skin_0000",
        "gun_sr_01_skin_0001",
        "gun_sr_01_skin_0002",
        "gun_sr_01_skin_0003",
        "gun_sr_01_skin_0004",
        "gun_sr_01_skin_0005",
        "gun_sr_01_skin_0006",
        "gun_sr_01_skin_0007",
        "gun_sr_01_skin_0008",
        "gun_sr_01_skin_0009"
    ],
    "weapon.gun_hg_02": [
        "gun_hg_02_skin_0000",
        "gun_hg_02_skin_0001",
        "gun_hg_02_skin_0002",
        "gun_hg_02_skin_0003",
        "gun_hg_02_skin_0004",
        "gun_hg_02_skin_0005",
        "gun_hg_02_skin_0006",
        "gun_hg_02_skin_0007",
        "gun_hg_02_skin_0008"
    ],
    "weapon.gun_lmg_02": [
        "gun_lmg_02_skin_0000",
        "gun_lmg_02_skin_0001",
        "gun_lmg_02_skin_0002",
        "gun_lmg_02_skin_0003",
        "gun_lmg_02_skin_0004",
        "gun_lmg_02_skin_0005",
        "gun_lmg_02_skin_0006",
        "gun_lmg_02_skin_0007"
    ],
    "weapon.gun_sr_02": [
        "gun_sr_02_skin_0000",
        "gun_sr_02_skin_0001",
        "gun_sr_02_skin_0002",
        "gun_sr_02_skin_0003",
        "gun_sr_02_skin_0004",
        "gun_sr_02_skin_0005",
        "gun_sr_02_skin_0006",
        "gun_sr_02_skin_0008"
    ],
    "weapon.gun_spl_01": [
        "gun_spl_01_skin_0000"
    ],
    "weapon.gun_sg_02": [
        "gun_sg_02_skin_0000",
        "gun_sg_02_skin_0001",
        "gun_sg_02_skin_0002",
        "gun_sg_02_skin_0003",
        "gun_sg_02_skin_0004"
    ]
  }
};

// Resolve current directory for serving panel.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static panel page
app.get("/panel", async (req, res) => {
  const { shortId } = req.query;

  // Step 1: show shortId input if not provided
  if (!shortId) {
    return res.send(`
      <html>
        <head><title>Customization Panel</title></head>
        <body style="font-family: sans-serif;">
          <h2>🔧 Customize Player Configuration</h2>
          <form method="GET" action="/panel">
            <label>Enter Short ID:</label>
            <input name="shortId" required placeholder="e.g. ll5natt6" />
            <button type="submit">Load</button>
          </form>
        </body>
      </html>
    `);
  }

  // Step 2: Fetch user config from DB
  let existingConfig = {};
  try {
    const result = await pool.query("SELECT config FROM user_configs WHERE short_id=$1", [shortId]);
    if (result.rows.length) existingConfig = result.rows[0].config;
  } catch (err) {
    console.error("DB fetch error:", err);
  }

  // Step 3: Define available options (this can come from DB or hardcoded)
  const ownedOptions = {
    "profile.avatar": [
      "char_droid_01_skin_0001",
      "char_droid_01_skin_0002",
      "char_droid_01_skin_0003"
    ],
    "vehicle.veh_bike_01": [
      "veh_bike_01_skin_0001",
      "veh_bike_01_skin_0053",
      "veh_bike_01_skin_0099"
    ],
    "trails": [
      "trl_0060",
      "trl_0064",
      "trl_0070"
    ]
  };

  // Step 4: Get currently selected values (fallbacks)
  const selected = {
    avatar: existingConfig?.equipped?.["profile.avatar"]?.[0]?.id || "",
    bike: existingConfig?.equipped?.["vehicle.veh_bike_01"]?.[0]?.id || "",
    trail: existingConfig?.equipped?.trails?.[0]?.id || ""
  };

  // Step 5: Render the UI
  res.send(`
    <html>
      <head>
        <title>Config Panel - ${shortId}</title>
      </head>
      <body style="font-family:sans-serif;">
        <h2>🎮 Edit Config for ShortId: ${shortId}</h2>

        <div>
          <label>Avatar:</label>
          <select id="avatarSelect">
            ${ownedOptions["profile.avatar"].map(
              opt => `<option value="${opt}" ${opt === selected.avatar ? "selected" : ""}>${opt}</option>`
            ).join("")}
          </select>
        </div>

        <div>
          <label>Bike Skin:</label>
          <select id="bikeSelect">
            ${ownedOptions["vehicle.veh_bike_01"].map(
              opt => `<option value="${opt}" ${opt === selected.bike ? "selected" : ""}>${opt}</option>`
            ).join("")}
          </select>
        </div>

        <div>
          <label>Trail:</label>
          <select id="trailSelect">
            ${ownedOptions["trails"].map(
              opt => `<option value="${opt}" ${opt === selected.trail ? "selected" : ""}>${opt}</option>`
            ).join("")}
          </select>
        </div>

        <br>
        <button onclick="saveConfig()">💾 Save</button>
        <button onclick="window.location.href='/panel'">⬅ Back</button>

        <script>
          async function saveConfig(){
            const config = {
              name: "${existingConfig?.name || "CustomUser"}",
              shortId: "${shortId}",
              group: "${existingConfig?.group || "default"}",
              levelInfo: { id: ${existingConfig?.levelInfo?.id || 19} },
              equipped: {
                "profile.avatar": [{ id: document.getElementById('avatarSelect').value }],
                "vehicle.veh_bike_01": [{ id: document.getElementById('bikeSelect').value }],
                "trails": [{ id: document.getElementById('trailSelect').value }]
              },
              owned: {
                "profile.avatar": [{ id: document.getElementById('avatarSelect').value }],
                "trails": [{ id: document.getElementById('trailSelect').value }]
              }
            };

            await fetch('/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ shortId: "${shortId}", config })
            });
            alert("✅ Config Saved!");
          }
        </script>
      </body>
    </html>
  `);
});



let lastEquipped = {}; // store latest /equip data

app.all("*", async (req, res) => {
  try {
    // Remove If-None-Match if exists
    if (req.headers["if-none-match"]) delete req.headers["if-none-match"];

    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;
    const headers = { ...req.headers };
    delete headers.host;

    // Handle /equip POST first
    if (req.path.includes("/equip") && req.method === "POST") {
      if (req.body.equippedId && req.body.equippedItems) {
        lastEquipped[req.body.equippedId] = req.body.equippedItems;
      }

      res.status(204).end();
      return;
    }

    // Forward request to upstream
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    let body = await upstreamResponse.text();

    // /get-broadcasts: just remove If-None-Match
    if (req.path === "/get-broadcasts") {
      
    }

    // Modify /guest-signups responses
    if (req.path.includes("/guest-signups")) {
      try {
        const json = JSON.parse(body);
        if (json.user?.owned) {
          json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
          json.user.owned.trails = customData.owned.trails;
          json.user.owned.emotes = customData.owned.emotes;
        }
        body = JSON.stringify(json);
      } catch (err) {
        console.error("Error modifying guest-signups response:", err);
      }
    }

    // Modify /user or /users responses
    // Modify /user or /users responses
if (req.path.includes("/user")) {
  try {
    const json = JSON.parse(body);

    // Identify shortId from the response (if present)
    const shortId = json.shortId || json.user?.shortId || null;

    // Get user-specific config if exists
    let userConfig = null;
    if (shortId) {
      const result = await pool.query("SELECT config FROM user_configs WHERE short_id=$1", [shortId]);
      if (result.rows.length) userConfig = result.rows[0].config;
    }

    // Merge base customData with DB override
    const activeConfig = userConfig || customData;

    if (json.equipped) {
      json.name = activeConfig.name;
      json.shortId = activeConfig.shortId;
      json.group = activeConfig.group;
      json.levelInfo.id = activeConfig.levelInfo.id;
      json.equipped = { ...json.equipped, ...activeConfig.equipped };
    }

    if (json.owned) {
      json.owned = { ...json.owned, ...activeConfig.owned };
    }

    body = JSON.stringify(json);
  } catch (err) {
    console.error("Error modifying /user or /users response:", err);
  }
}


    // Copy upstream headers to response
    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
