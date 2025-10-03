import express from "express";
import fetch from "node-fetch";

const app = express();

// Middleware to capture raw request body
app.use((req, res, next) => {
  let data = "";
  req.on("data", chunk => { data += chunk; });
  req.on("end", () => {
    req.rawBody = data;
    next();
  });
});

// Middleware to parse JSON and URL-encoded bodies as usual
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Your custom owned data
const customData = {
  owned: {
    "profile.avatar": [
      { id: "char_droid_01_skin_0000" },
      { id: "char_droid_01_skin_0001" },
      { id: "char_droid_01_skin_0002" },
      { id: "char_droid_02_skin_0000" },
      { id: "char_droid_03_skin_0000" },
      { id: "char_female_01_skin_0004" },
      { id: "char_female_01_skin_0005" },
      { id: "char_female_01_skin_0006" },
      { id: "char_female_01_skin_0007" },
      { id: "char_female_01_skin_0008" },
      { id: "char_female_01_skin_0009" },
      { id: "char_female_01_skin_0010" },
      { id: "char_female_02_skin_0000" },
      { id: "char_female_03_skin_0004" },
      { id: "char_female_03_skin_0005" },
      { id: "char_female_03_skin_0006" },
      { id: "char_female_03_skin_0007" },
      { id: "char_female_03_skin_0008" },
      { id: "char_female_03_skin_0009" },
      { id: "char_female_03_skin_0011" },
      { id: "char_female_03_skin_0012" },
      { id: "char_female_04_skin_0000" },
      { id: "char_female_05_skin_0000" },
      { id: "char_female_06_skin_0000" },
      { id: "char_female_06_skin_0001" },
      { id: "char_female_06_skin_0002" },
      { id: "char_female_07_skin_0000" },
      { id: "char_female_08_skin_0000" },
      { id: "char_male_01_skin_0004" },
      { id: "char_male_01_skin_0005" },
      { id: "char_male_01_skin_0006" },
      { id: "char_male_01_skin_0007" },
      { id: "char_male_01_skin_0008" },
      { id: "char_male_01_skin_0009" },
      { id: "char_male_01_skin_0010" },
      { id: "char_male_01_skin_0011" },
      { id: "char_male_01_skin_0012" },
      { id: "char_male_01_skin_0013" },
      { id: "char_male_02_skin_0000" },
      { id: "char_male_03_skin_0002" },
      { id: "char_male_03_skin_0003" },
      { id: "char_male_03_skin_0004" },
      { id: "char_male_03_skin_0005" },
      { id: "char_male_03_skin_0006" },
      { id: "char_male_03_skin_0007" },
      { id: "char_male_03_skin_0008" },
      { id: "char_male_03_skin_0009" },
      { id: "char_male_04_skin_0000" },
      { id: "char_male_05_skin_0000" },
      { id: "char_male_05_skin_0001" },
      { id: "char_male_06_skin_0000" },
      { id: "char_male_06_skin_0001" },
      { id: "char_male_06_skin_0002" },
      { id: "char_male_06_skin_0003" },
      { id: "char_male_07_skin_0000" },
      { id: "char_male_07_skin_0001" },
      { id: "char_male_07_skin_0002" },
      { id: "char_male_07_skin_0003" },
      { id: "char_male_08_skin_0000" },
      { id: "char_male_08_skin_0001" },
      { id: "char_male_09_skin_0000" },
      { id: "char_male_09_skin_0001" },
      { id: "char_male_09_skin_0002" },
      { id: "char_male_10_skin_0000" },
      { id: "char_male_11_skin_0000" }
    ],
    trails: [
      { id: "trl_0001" },
      { id: "trl_0002" },
      { id: "trl_0003" },
      { id: "trl_0004" },
      { id: "trl_0005" }
      // Add remaining trails...
    ],
    emotes: [
      { id: "emt_0001" },
      { id: "emt_0002" }
      // Add remaining emotes...
    ]
  }
};

// Health check endpoint for Render
app.get("/healthz", (req, res) => {
  res.send("ok");
});

// Main proxy route
app.all("*", async (req, res) => {
  try {
    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;

    const headers = { ...req.headers };
    delete headers.host; // optional, but usually safe

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.rawBody
    });

    let body = await upstreamResponse.text();

    // Modify specific endpoints
    if (req.path.includes("/guest-signups") || req.path.includes("/user") || req.path.includes("/social/sign-in")) {
      if (upstreamResponse.headers.get("content-type")?.includes("application/json")) {
        try {
          const json = JSON.parse(body);

          if (json.user?.owned) {
            json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
            json.user.owned.trails = customData.owned.trails;
            json.user.owned.emotes = customData.owned.emotes;
          }

          body = JSON.stringify(json);
        } catch (err) {
          console.error("Error modifying JSON response:", err);
        }
      }
    }

    // Forward headers safely
    for (const [key, value] of upstreamResponse.headers.entries()) {
      if (!["transfer-encoding", "content-encoding", "content-length"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }

    res.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(502).send("Bad Gateway");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
