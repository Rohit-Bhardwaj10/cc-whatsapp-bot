const axios = require("axios");
const cheerio = require("cheerio");

// async function getGFGPOTD() {
//   try {
//     console.log("🔍 Fetching GFG POTD page...");

//     const response = await axios.get(
//       "https://www.geeksforgeeks.org/problem-of-the-day",
//       {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//           Accept:
//             "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//           "Accept-Language": "en-US,en;q=0.5",
//           Connection: "keep-alive",
//           "Upgrade-Insecure-Requests": "1",
//         },
//         timeout: 15000,
//       }
//     );

//     console.log(`✅ Page fetched successfully, status: ${response.status}`);
//     const $ = cheerio.load(response.data);

//     // Find the anchor with id 'potd_solve_prob' and extract its href
//     const potdAnchor = $("a#potd_solve_prob");
//     if (potdAnchor.length > 0) {
//       let potdLink = potdAnchor.attr("href");
//       console.log(`Found anchor with id 'potd_solve_prob': ${potdLink}`);
//       if (potdLink) {
//         // Ensure the link is absolute
//         if (!potdLink.startsWith("http")) {
//           if (potdLink.startsWith("/")) {
//             potdLink = "https://www.geeksforgeeks.org" + potdLink;
//           } else {
//             potdLink = "https://www.geeksforgeeks.org/" + potdLink;
//           }
//         }
//         console.log("🎯 Final GFG POTD link:", potdLink);
//         return potdLink;
//       }
//     }

//     // Final Fallback: Return the main POTD page
//     console.log(
//       "⚠️ Could not find specific problem link, using POTD page as fallback"
//     );
//     return "https://www.geeksforgeeks.org/problem-of-the-day";
//   } catch (error) {
//     console.error("❌ Error fetching GFG POTD:", error.message);
//     console.log("⚠️ Using POTD page as fallback due to error");
//     return "https://www.geeksforgeeks.org/problem-of-the-day";
//   }
// }

async function getLeetCodePOTD() {
  try {
    const res = await axios.post(
      "https://leetcode.com/graphql/",
      {
        query: `
          query questionOfToday {
            activeDailyCodingChallengeQuestion {
              question {
                titleSlug
                title
                difficulty
              }
            }
          }
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/problemset/all/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    const questionData =
      res.data?.data?.activeDailyCodingChallengeQuestion?.question;
    const slug = questionData?.titleSlug;

    if (slug) {
      const link = `https://leetcode.com/problems/${slug}/`;
      console.log(
        "Found LeetCode POTD:",
        questionData.title,
        `(${questionData.difficulty})`
      );
      return link;
    }

    return "LeetCode link not found";
  } catch (error) {
    console.error("Error fetching LeetCode POTD:", error.message);
    return "LeetCode POTD not available";
  }
}

// Alternative function for GFG using different approach
async function getGFGPOTDAlternative() {
  try {
    // Try the mobile version which might have simpler structure
    const response = await axios.get(
      "https://practice.geeksforgeeks.org/problem-of-the-day",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
        },
      }
    );

    const $ = cheerio.load(response.data);

    // Look for any script tags that might contain the problem URL
    let potdLink = null;

    $("script").each((i, script) => {
      const scriptContent = $(script).html();
      if (scriptContent) {
        // Look for problem URLs in JavaScript
        const problemMatch = scriptContent.match(/\/problems\/[^"'\s]+/);
        if (problemMatch) {
          potdLink = "https://practice.geeksforgeeks.org" + problemMatch[0];
          return false;
        }
      }
    });

    return potdLink || "GFG POTD link not found (alternative method)";
  } catch (error) {
    console.error("Error with GFG alternative method:", error.message);
    return "GFG POTD not available (alternative method)";
  }
}

// Test function to try both methods
async function testBothMethods() {
  console.log("Testing main GFG method...");
  const result1 = await getGFGPOTD();
  console.log("Main method result:", result1);

  console.log("\nTesting alternative GFG method...");
  const result2 = await getGFGPOTDAlternative();
  console.log("Alternative method result:", result2);

  console.log("\nTesting LeetCode method...");
  const result3 = await getLeetCodePOTD();
  console.log("LeetCode result:", result3);
}

// Debug function to help identify the correct link
// async function debugGFGPOTD() {
//   try {
//     console.log("🔍 Debugging GFG POTD page...");

//     const response = await axios.get(
//       "https://www.geeksforgeeks.org/problem-of-the-day",
//       {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//         },
//       }
//     );

//     const $ = cheerio.load(response.data);

//     console.log(
//       "\n📋 Looking for GFG problem pattern (/problems/name/number):"
//     );
//     const problemPattern = /\/problems\/[a-zA-Z0-9\-]+\/\d+/;
//     const potentialLinks = [];

//     $("a").each((i, el) => {
//       const href = $(el).attr("href");
//       const text = $(el).text().trim();

//       if (href && problemPattern.test(href)) {
//         potentialLinks.push({
//           href,
//           text,
//           index: i,
//           fullElement: $(el).toString().substring(0, 150),
//         });
//       }
//     });

//     console.log(`Found ${potentialLinks.length} links matching the pattern:`);
//     potentialLinks.forEach((link, i) => {
//       console.log(`${i + 1}. ${link.href}`);
//       console.log(`   Text: "${link.text}"`);
//       console.log(`   Element: ${link.fullElement}...`);
//       console.log("---");
//     });

//     console.log("\n🔍 Looking for solve/practice buttons:");
//     const buttonTexts = [
//       "Solve Problem",
//       "Practice",
//       "Solve Now",
//       "Start Problem",
//       "Solve",
//     ];
//     buttonTexts.forEach((buttonText) => {
//       const buttons = $(`a:contains("${buttonText}")`);
//       if (buttons.length) {
//         console.log(`Found "${buttonText}" button(s): ${buttons.length}`);
//         buttons.each((i, el) => {
//           const href = $(el).attr("href");
//           const text = $(el).text().trim();
//           console.log(`  ${i + 1}: ${href} | "${text}"`);
//         });
//       }
//     });

//     console.log("\n🎯 Script content analysis:");
//     let scriptProblemLinks = [];
//     $("script").each((i, script) => {
//       const scriptContent = $(script).html();
//       if (scriptContent) {
//         const matches = scriptContent.match(/\/problems\/[a-zA-Z0-9\-]+\/\d+/g);
//         if (matches) {
//           scriptProblemLinks = [...scriptProblemLinks, ...matches];
//         }
//       }
//     });

//     if (scriptProblemLinks.length > 0) {
//       console.log(
//         `Found ${scriptProblemLinks.length} problem links in scripts:`
//       );
//       [...new Set(scriptProblemLinks)].forEach((link, i) => {
//         console.log(`${i + 1}. ${link}`);
//       });
//     } else {
//       console.log("No problem links found in script tags");
//     }

//     return "Debug complete - check console output";
//   } catch (error) {
//     console.error("Debug error:", error.message);
//     return "Debug failed";
//   }
// }

module.exports = {
  //   getGFGPOTD,
  getLeetCodePOTD,
  //   getGFGPOTDAlternative,
  testBothMethods,
  //   debugGFGPOTD,
};
