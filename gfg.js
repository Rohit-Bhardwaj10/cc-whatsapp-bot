const puppeteer = require("puppeteer");

async function getGFGPOTDWithPuppeteer() {
  const url = "https://www.geeksforgeeks.org/problem-of-the-day";
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Wait for a possible "Solve Problem" button or any anchor likely to contain the POTD
  // These selectors may need to be updated if GFG changes their layout
  const potdLink = await page.evaluate(() => {
    // Try common button styles/texts first
    const buttonTexts = [
      "Solve Problem",
      "Solve Now",
      "Start Problem",
      "Practice",
      "Solve",
    ];
    let potdAnchor = null;

    // Try to find a button containing one of those texts
    buttonTexts.some((text) => {
      const el = Array.from(document.querySelectorAll("a,button")).find(
        (a) => a.textContent && a.textContent.trim().includes(text)
      );
      if (el && el.href) {
        potdAnchor = el.href;
        return true;
      }
      return false;
    });

    // As fallback, search for links to /problems/ pattern
    if (!potdAnchor) {
      const anchors = Array.from(document.querySelectorAll("a"));
      const prob = anchors.find(
        (a) => a.href && /\/problems\/[a-zA-Z0-9\-]+\/\d+\/?$/.test(a.pathname)
      );
      if (prob && prob.href) potdAnchor = prob.href;
    }
    return potdAnchor;
  });

  await browser.close();

  if (potdLink) {
    console.log("🎯 POTD Link:", potdLink);
    return potdLink;
  } else {
    console.log("⚠️ Couldn't find POTD link. Defaulting to POTD page.");
    return url;
  }
}

// Run it:
module.exports = { getGFGPOTDWithPuppeteer };
