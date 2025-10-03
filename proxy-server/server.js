import express from "express";
import fetch from "node-fetch";

const app = express();

// Middleware to capture raw body
app.use((req, res, next) => {
  let data = [];
  req.on("data", chunk => data.push(chunk));
  req.on("end", () => {
    req.rawBody = Buffer.concat(data);
    next();
  });
  req.on("error", err => {
    console.error("Error reading body:", err);
    res.status(400).send("Error reading body");
  });
});

// Custom data to inject
const customData = {
  owned: {
    "profile.avatar": [{ id: "char_droid_01_skin_0000" }],
    trails: [{ id: "trl_0001" }],
    emotes: [{ id: "emt_0001" }]
  }
};

// Proxy all requests
app.all("*", async (req, res) => {
  try {
    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;

    // Clone headers and remove host
    const headers = { ...req.headers };
    delete headers.host;

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.rawBody
    });

    let body = await upstreamResponse.text();

    // Modify JSON if applicable
    if (req.path.includes("/guest-signups") || req.path.includes("/user") || req.path.includes("/social/sign-in")) {
      try {
        const json = JSON.parse(body);
        if (json.user?.owned) {
          json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
          json.user.owned.trails = customData.owned.trails;
          json.user.owned.emotes = customData.owned.emotes;
        }
        body = JSON.stringify(json);
      } catch (err) {
        console.error("Error modifying JSON:", err);
      }
    }

    // Forward headers safely
    upstreamResponse.headers.forEach((value, key) => {
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
