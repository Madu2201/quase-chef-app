const http = require("http");

const PORT = process.env.PORT || 3000;
const TIMEOUT_MS = 30000;
const PATH = "/generate-image";

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== PATH) {
    sendJson(res, 404, {
      success: false,
      error: "Not found",
    });

    return;
  }

  try {
    const body = await parseJsonBody(req);

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    const model = typeof body.model === "string" ? body.model : "flux";

    const width = typeof body.width === "number" ? body.width : 1024;

    const height = typeof body.height === "number" ? body.height : 1024;

    if (!prompt) {
      sendJson(res, 400, {
        success: false,
        error: "Prompt is required",
      });

      return;
    }

    const seed = Math.floor(Math.random() * 1000000);

    const promptEncoded = encodeURIComponent(prompt);

    const url =
      `https://pollinations.ai/p/${promptEncoded}` +
      `?width=${width}` +
      `&height=${height}` +
      `&seed=${seed}` +
      `&model=${model}` +
      `&nologo=true`;

    console.log("Generating image:", prompt);

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      sendJson(res, 502, {
        success: false,
        error: `Pollinations request failed ${response.status}`,
      });

      return;
    }
    console.log("Content-Type:", response.headers.get("content-type"));

    console.log("Status:", response.status);

    const arrayBuffer = await response.arrayBuffer();

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const imageUrl = `data:image/jpeg;base64,${base64}`;

    sendJson(res, 200, {
      success: true,
      base64: imageUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(message);

    if (message === "The operation was aborted") {
      sendJson(res, 504, {
        success: false,
        error: "Timeout fetching image",
      });

      return;
    }

    sendJson(res, 500, {
      success: false,
      error: message,
    });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Image proxy server running on:` + ` http://192.168.1.86:${PORT}${PATH}`,
  );
});
