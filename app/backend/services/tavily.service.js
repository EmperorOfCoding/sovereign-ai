/**
 * Tavily Evidence Service
 *
 * Executes two parallel searches to collect real, traceable market signals:
 *  1. Complaints query  — forums, Reddit, Reclame Aqui, social media
 *  2. Research query    — market studies, reports, industry data
 *
 * Returns up to 10 deduplicated RawEvidence items.
 * Gracefully degrades: if Tavily is unavailable, returns an empty array
 * so the OpenRouter analysis pipeline can still proceed.
 */

const { tavily } = require("@tavily/core");

const TAVILY_TIMEOUT_MS = 15000; // 15 seconds per search

/**
 * @typedef {Object} RawEvidence
 * @property {string} source  - Domain / site name (e.g. "reddit.com")
 * @property {string} url     - Full URL for traceability
 * @property {string} text    - Verbatim snippet (≤ 200 chars)
 * @property {'complaint'|'research'} type - Evidence category
 * @property {string} publishedDate - ISO date from source or collection timestamp
 */

/**
 * Derives a readable source label from a URL.
 * @param {string} url
 * @returns {string}
 */
function extractSource(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "fonte desconhecida";
  }
}

/**
 * Truncates a string to maxLen characters, appending "…" if trimmed.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(str, maxLen = 200) {
  if (!str || str.length <= maxLen) return str || "";
  return str.substring(0, maxLen).trimEnd() + "…";
}

/**
 * Fetches real market evidences from Tavily.
 *
 * @param {string} problem - The optimized problem statement (after query rewriter)
 * @returns {Promise<RawEvidence[]>} Array of 0–20 raw evidence items
 */
async function fetchEvidences(problem) {
  const apiKey = process.env.TAVILY_API_KEY;
  const isDebug = process.env.LOG_LEVEL === "debug";

  if (!apiKey) {
    console.warn("[Tavily] ⚠️  TAVILY_API_KEY not set — skipping evidence collection.");
    return [];
  }

  const client = tavily({ apiKey });

  // Build two targeted search queries from the problem statement.
  // We avoid strict quotes around ${problem} so the search engine can match natural occurrences.
  const complaintsQuery = `problemas OR reclamações OR erro ${problem} site:reddit.com OR site:reclameaqui.com.br OR site:twitter.com`;
  const researchQuery = `dados mercado estatísticas ${problem}`;

  if (isDebug) {
    console.log(`[Tavily] → Complaints query: "${complaintsQuery}"`);
    console.log(`[Tavily] → Research query:   "${researchQuery}"`);
  }

  /**
   * Wraps a Tavily search with a timeout and maps results to RawEvidence.
   * Resolves to an empty array on any error.
   *
   * @param {Function} searchFn
   * @param {'complaint'|'research'} type
   * @returns {Promise<RawEvidence[]>}
   */
  async function safeSearch(searchFn, type) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TAVILY_TIMEOUT_MS);

    try {
      const response = await searchFn();
      const results = response?.results ?? [];

      const collectedAt = new Date().toISOString();

      return results
        .filter((r) => r.url && r.content)
        .map((r) => ({
          source: extractSource(r.url),
          url: r.url,
          text: truncate(r.content),
          type,
          publishedDate: r.published_date || collectedAt,
        }));
    } catch (err) {
      console.warn(`[Tavily] ⚠️  ${type} search failed: ${err.message}`);
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Run both searches in parallel
  const [complaints, research] = await Promise.all([
    safeSearch(
      () =>
        client.search(complaintsQuery, {
          maxResults: 5,
          searchDepth: "basic",
          includeRawContent: false,
        }),
      "complaint"
    ),
    safeSearch(
      () =>
        client.search(researchQuery, {
          maxResults: 5,
          searchDepth: "basic",
          includeRawContent: false,
        }),
      "research"
    ),
  ]);

  // Deduplicate by URL and merge (complaints first, then research)
  const seen = new Set();
  const evidences = [...complaints, ...research].filter((ev) => {
    if (seen.has(ev.url)) return false;
    seen.add(ev.url);
    return true;
  });

  if (isDebug) {
    console.log(
      `[Tavily] ✅ ${complaints.length} complaints + ${research.length} research = ${evidences.length} unique evidences`
    );
  }

  return evidences;
}

module.exports = { fetchEvidences };
