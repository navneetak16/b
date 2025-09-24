import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Replace with your full dump values
const customData = {
  owned: {
    "profile.avatar": [
        { id: "char_female_01_skin_0004" },
        { id: "char_female_03_skin_0004" },
        { id: "char_female_06_skin_0000" },
        { id: "char_male_01_skin_0004" },
        { id: "char_male_07_skin_0002" },
        { id: "char_droid_01_skin_0002" },
        { id: "char_droid_00_skin_0001" },
        { id: "char_droid_00_skin_0002" },
        { id: "char_droid_01_skin_0001" }
      ]
    },
    "trails": [
      { id: "trl_0001" }, { id: "trl_0002" }, { id: "trl_0003" },
      { id: "trl_0004" }, { id: "trl_0005" }, { id: "trl_0006" },
      { id: "trl_0007" }, { id: "trl_0008" }, { id: "trl_0009" },
      { id: "trl_0010" } // … add all from your dump
    ],
    "emotes": [
      { id: "emt_0001" }, { id: "emt_0002" }, { id: "emt_0003" },
      { id: "emt_0004" }, { id: "emt_0005" }, { id: "emt_0006" },
      { id: "emt_0007" }, { id: "emt_0008" }, { id: "emt_0009" },
      { id: "emt_0010" } // … add all from your dump
    ]
  }
};

app.all("*", async (req, res) => {
  try {
    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;
    const headers = { ...req.headers };
    delete headers.host;

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    let body = await upstreamResponse.text();

    // ✅ Modify guest-signups only
    if (req.path.includes("/guest-signups")) {
      try {
        const json = JSON.parse(body);

        if (json.user?.owned) {
          json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
          json.user.owned["trails"] = customData.owned["trails"];
          json.user.owned["emotes"] = customData.owned["emotes"];
        }

        body = JSON.stringify(json);
      } catch (err) {
        console.error("Error modifying guest-signups response:", err);
      }
    }

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
