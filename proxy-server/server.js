import express from "express";
import fetch from "node-fetch";

const app = express();

// 1️⃣ Capture raw body BEFORE any other parser
app.use((req, res, next) => {
  let data = "";
  req.on("data", chunk => { data += chunk; });
  req.on("end", () => { req.rawBody = data; next(); });
});

// 2️⃣ JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3️⃣ Custom data to inject
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
      { id: "char_female_01_skin_0010" }
    ],
    trails: [
      { id: "trl_0001" },
      { id: "trl_0002" },
      { id: "trl_0003" }
    ],
    emotes: [
      { id: "emt_0001" },
      { id: "emt_0002" },
      { id: "emt_0003" }
    ]
  }
};

// 4️⃣ Proxy all requests
app.all("*", async (req, res) => {
  try {
    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;

    // Clone headers, remove host
    const headers = { ...req.headers };
    delete headers.host;

    // Forward the request
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.rawBody
    });

    let body = await upstreamResponse.text();

    // Modify JSON safely
    if (
      req.path.includes("/guest-signups") ||
      req.path.includes("/user") ||
      req.path.includes("/social/sign-in")
    ) {
      try {
        const json = JSON.parse(body);

        if (json.user?.owned) {
          json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
          json.user.owned.trails = customData.owned.trails;
          json.user.owned.emotes = customData.owned.emotes;
        }

        body = JSON.stringify(json);
      } catch (err) {
        console.error("JSON modification error:", err);
      }
    }

    // Forward headers safely
    upstreamResponse.headers.forEach((value, key) => {
      // Avoid duplicate or unsafe headers
      if (!["transfer-encoding", "content-length", "content-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy internal error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
