import * as XLSX from "npm:xlsx@0.18.5";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Known DM01 Provider XLS URLs by period
const KNOWN_URLS: Record<string, string> = {
  "2025-07":
    "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/09/Monthly-Diagnostics-Provider-July-2025.xls",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DATA_PAGE_URLS = [
  "https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/monthly-diagnostics-waiting-times-and-activity/monthly-diagnostics-data-2025-26/",
  "https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/monthly-diagnostics-waiting-times-and-activity/monthly-diagnostics-data-2024-25/",
];

/**
 * Generate candidate direct URLs for the provider XLS based on common NHS patterns.
 */
function generateCandidateUrls(period: string): string[] {
  const [year, month] = period.split("-");
  const monthName = MONTH_NAMES[parseInt(month, 10) - 1];
  if (!monthName) return [];

  // NHS publishes ~2 months later, so try multiple upload month directories
  const pubYear = parseInt(year, 10);
  const pubMonth = parseInt(month, 10);
  const candidates: string[] = [];

  for (let offset = 1; offset <= 4; offset++) {
    let pm = pubMonth + offset;
    let py = pubYear;
    if (pm > 12) { pm -= 12; py += 1; }
    const pmStr = String(pm).padStart(2, "0");
    candidates.push(
      `https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/${py}/${pmStr}/Monthly-Diagnostics-Provider-${monthName}-${year}.xls`,
      `https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/${py}/${pmStr}/Monthly-Diagnostics-Provider-${monthName}-${year}.xlsx`,
    );
  }
  return candidates;
}

/**
 * Try to discover the Provider XLS link from the NHS data page HTML.
 */
async function discoverProviderXlsUrl(period: string): Promise<string | null> {
  const [year, month] = period.split("-");
  const monthName = MONTH_NAMES[parseInt(month, 10) - 1];
  if (!monthName) return null;

  for (const pageUrl of DATA_PAGE_URLS) {
    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LovableBot/1.0)" },
      });
      if (!res.ok) continue;
      const html = await res.text();

      const linkRegex =
        /href="(https?:\/\/[^"]*Monthly-Diagnostics-Provider[^"]*\.xls[x]?)"/gi;
      let match;
      const candidates: string[] = [];
      while ((match = linkRegex.exec(html)) !== null) {
        candidates.push(match[1]);
      }
      if (candidates.length === 0) continue;

      const target = candidates.find(
        (url) =>
          url.toLowerCase().includes(monthName.toLowerCase()) &&
          url.includes(year)
      );
      if (target) return target;
      if (candidates.length > 0) return candidates[0];
    } catch (err) {
      console.error("Error discovering XLS URL from", pageUrl, err);
    }
  }
  return null;
}

/**
 * Try to fetch an XLS file from a list of URLs, returning the first successful buffer.
 */
async function tryFetchUrls(urls: string[]): Promise<Uint8Array | null> {
  for (const url of urls) {
    try {
      console.log(`Trying URL: ${url}`);
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LovableBot/1.0)" },
      });
      if (res.ok) {
        console.log(`Success: ${url}`);
        return new Uint8Array(await res.arrayBuffer());
      }
      console.log(`Failed (${res.status}): ${url}`);
    } catch (e) {
      console.log(`Error fetching ${url}: ${e}`);
    }
  }
  return null;
}

/**
 * Normalise a header string: lowercase, trim, collapse whitespace.
 */
function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { providerCode = "R0A", period = "2025-07" } = await req.json();

    // ── 1. Resolve the XLS URL ──────────────────────────────────
    let xlsUrl = KNOWN_URLS[period] ?? null;
    if (!xlsUrl) {
      xlsUrl = await discoverProviderXlsUrl(period);
    }
    if (!xlsUrl) {
      return new Response(
        JSON.stringify({ error: `No DM01 data URL found for period ${period}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 2. Download the XLS file ────────────────────────────────
    console.log(`Fetching XLS from ${xlsUrl}`);
    const xlsRes = await fetch(xlsUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LovableBot/1.0)" },
    });
    if (!xlsRes.ok) {
      // Try discovery as fallback if hardcoded URL failed
      const discovered = await discoverProviderXlsUrl(period);
      if (discovered && discovered !== xlsUrl) {
        const retryRes = await fetch(discovered, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LovableBot/1.0)" },
        });
        if (!retryRes.ok) {
          return new Response(
            JSON.stringify({ error: "Could not fetch DM01 data from NHS England" }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        var buffer = new Uint8Array(await retryRes.arrayBuffer());
      } else {
        return new Response(
          JSON.stringify({ error: "Could not fetch DM01 data from NHS England" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      var buffer = new Uint8Array(await xlsRes.arrayBuffer());
    }

    // ── 3. Parse the spreadsheet ────────────────────────────────
    const workbook = XLSX.read(buffer, { type: "array" });
    // Use the first sheet (usually "Provider" data)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: 0,
    });

    if (!rows.length) {
      return new Response(
        JSON.stringify({ error: "Spreadsheet appears empty" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 4. Identify column names dynamically ────────────────────
    const headers = Object.keys(rows[0]);
    const findCol = (patterns: string[]) =>
      headers.find((h) => patterns.some((p) => norm(h).includes(p)));

    const providerCodeCol =
      findCol(["provider code", "org code", "organisation code"]) ?? headers[0];
    const providerNameCol =
      findCol(["provider name", "org name", "organisation name"]) ?? headers[1];
    const testNameCol =
      findCol(["diagnostic test", "test name", "procedure", "diagnostic"]) ??
      headers[2];

    // Waiting-list weekly band columns (look for patterns like "0-1", "1-2", … "13+")
    const weekBandCols = headers.filter((h) => {
      const n = norm(h);
      return (
        /\d+\s*[-–]\s*\d+/.test(n) ||
        /\d+\s*\+/.test(n) ||
        n.includes("weeks")
      );
    });

    // 6+ weeks column(s) – columns representing ≥6 weeks waited
    const sixPlusCols = weekBandCols.filter((h) => {
      const n = norm(h);
      // Match "6-7", "7-8", …, "13+", "6+" etc.
      const m = n.match(/(\d+)/);
      return m && parseInt(m[1], 10) >= 6;
    });

    const totalWaitingCol = findCol(["total waiting", "total wl", "total list"]);
    const activityCol = findCol(["activity", "total activity"]);

    console.log("Detected columns:", {
      providerCodeCol,
      providerNameCol,
      testNameCol,
      weekBandCols: weekBandCols.length,
      sixPlusCols: sixPlusCols.length,
      totalWaitingCol,
      activityCol,
    });

    // ── 5. Filter rows for the requested provider ───────────────
    const providerRows = rows.filter(
      (r) =>
        String(r[providerCodeCol] ?? "")
          .trim()
          .toUpperCase() === providerCode.toUpperCase()
    );

    if (!providerRows.length) {
      return new Response(
        JSON.stringify({
          error: `Provider ${providerCode} not found in DM01 data`,
          availableColumns: headers.slice(0, 10),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providerName = String(
      providerRows[0][providerNameCol] ?? providerCode
    ).trim();

    // ── 6. Extract per-test data ────────────────────────────────
    const toNum = (v: unknown) => {
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    };

    interface TestRow {
      test_code: string;
      test_description: string;
      total_waiting_list: number;
      waiting_6_plus_weeks: number;
      percent_6_plus_weeks: number;
      total_activity: number;
    }

    const tests: TestRow[] = providerRows.map((r) => {
      const testName = String(r[testNameCol] ?? "Unknown").trim();

      // Total waiting list: use dedicated column or sum all week bands
      let totalWaiting = totalWaitingCol ? toNum(r[totalWaitingCol]) : 0;
      if (!totalWaiting && weekBandCols.length) {
        totalWaiting = weekBandCols.reduce((s, c) => s + toNum(r[c]), 0);
      }

      // 6+ weeks waiting
      const waiting6Plus = sixPlusCols.reduce((s, c) => s + toNum(r[c]), 0);

      const pct =
        totalWaiting > 0
          ? Math.round((waiting6Plus / totalWaiting) * 10000) / 100
          : 0;

      const activity = activityCol ? toNum(r[activityCol]) : 0;

      // Derive a short test code from the name
      const testCode = testName
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(/\s+/)
        .slice(0, 3)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

      return {
        test_code: testCode || "UNK",
        test_description: testName,
        total_waiting_list: totalWaiting,
        waiting_6_plus_weeks: waiting6Plus,
        percent_6_plus_weeks: pct,
        total_activity: activity,
      };
    });

    // ── 7. Build summary ────────────────────────────────────────
    const summaryTotalWaiting = tests.reduce(
      (s, t) => s + t.total_waiting_list,
      0
    );
    const summaryWaiting6Plus = tests.reduce(
      (s, t) => s + t.waiting_6_plus_weeks,
      0
    );
    const summaryPct =
      summaryTotalWaiting > 0
        ? Math.round((summaryWaiting6Plus / summaryTotalWaiting) * 10000) / 100
        : 0;
    const summaryActivity = tests.reduce((s, t) => s + t.total_activity, 0);

    let status: string;
    if (summaryPct <= 1) status = "Operational";
    else if (summaryPct <= 5) status = "Degraded";
    else status = "At Risk";

    // ── 8. Persist to database ──────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert per-test rows
    const cacheRows = tests.map((t) => ({
      provider_code: providerCode.toUpperCase(),
      provider_name: providerName,
      period,
      test_code: t.test_code,
      test_description: t.test_description,
      total_waiting_list: t.total_waiting_list,
      waiting_6_plus_weeks: t.waiting_6_plus_weeks,
      percent_6_plus_weeks: t.percent_6_plus_weeks,
      total_activity: t.total_activity,
    }));

    const { error: cacheErr } = await supabase
      .from("diagnostics_cache")
      .upsert(cacheRows, {
        onConflict: "provider_code,period,test_code",
      });

    if (cacheErr) console.error("diagnostics_cache upsert error:", cacheErr);

    // Upsert summary row
    const { error: summaryErr } = await supabase
      .from("diagnostics_summary")
      .upsert(
        {
          provider_code: providerCode.toUpperCase(),
          provider_name: providerName,
          period,
          total_waiting_list: summaryTotalWaiting,
          total_waiting_6_plus_weeks: summaryWaiting6Plus,
          percent_6_plus_weeks: summaryPct,
          total_activity: summaryActivity,
          status,
        },
        { onConflict: "provider_code,period" }
      );

    if (summaryErr) console.error("diagnostics_summary upsert error:", summaryErr);

    // ── 9. Return response ──────────────────────────────────────
    const result = {
      provider_code: providerCode.toUpperCase(),
      provider_name: providerName,
      period,
      summary: {
        total_waiting_list: summaryTotalWaiting,
        total_waiting_6_plus_weeks: summaryWaiting6Plus,
        percent_6_plus_weeks: summaryPct,
        total_activity: summaryActivity,
        status,
      },
      tests,
      meta: {
        rows_parsed: providerRows.length,
        sheet_name: sheetName,
        xls_url: xlsUrl,
        db_errors: {
          cache: cacheErr?.message ?? null,
          summary: summaryErr?.message ?? null,
        },
      },
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
