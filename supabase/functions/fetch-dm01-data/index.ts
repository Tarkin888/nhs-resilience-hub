import * as XLSX from "npm:xlsx@0.18.5";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Known DM01 Provider XLS URLs by period (from NHS England 2025-26 page)
const KNOWN_URLS: Record<string, string> = {
  "2026-01": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/03/Monthly-Diagnostics-Web-File-Provider-January-2026_42P3N.xls",
  "2025-12": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/02/Monthly-Diagnostics-Web-File-Provider-December-2025_EDNKH.xls",
  "2025-11": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/01/Monthly-Diagnostics-Web-File-Provider-November-2025_8HM0N.xls",
  "2025-10": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/12/Monthly-Diagnostics-Web-File-Provider-October-2025_F5GI8.xls",
  "2025-09": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/11/Monthly-Diagnostics-Web-File-Provider-September-2025_M0NX3.xls",
  "2025-08": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/10/Monthly-Diagnostics-Web-File-Provider-August-2025_EJKO9.xls",
  "2025-07": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/09/Monthly-Diagnostics-Web-File-Provider-July-2025_L8FLO.xls",
  "2025-06": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/08/Monthly-Diagnostics-Web-File-Provider-June-2025_45KNG.xls",
  "2025-05": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/07/Monthly-Diagnostics-Web-File-Provider-May-2025.xls",
  "2025-04": "https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/06/Monthly-Diagnostics-Web-File-Provider-April-2025_3EY67.xls",
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
        /href="(https?:\/\/[^"]*(?:Monthly-Diagnostics-(?:Web-File-)?Provider)[^"]*\.xls[x]?)"/gi;
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
    const { providerCode = "R0A", period = "2026-01" } = await req.json();

    // ── 1. Resolve and download the XLS file ──────────────────
    // Build a prioritised list of URLs to try
    const urlsToTry: string[] = [];
    
    // First: hardcoded known URL
    if (KNOWN_URLS[period]) urlsToTry.push(KNOWN_URLS[period]);
    
    // Try known URLs first (fast, no page scraping needed)
    let buffer = await tryFetchUrls(urlsToTry);
    
    // Third: try discovery from HTML page as last resort
    if (!buffer) {
      const discovered = await discoverProviderXlsUrl(period);
      if (discovered) {
        buffer = await tryFetchUrls([discovered]);
      }
    }
    
    if (!buffer) {
      return new Response(
        JSON.stringify({ error: "Could not fetch DM01 data from NHS England" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 3. Parse the spreadsheet ────────────────────────────────
    const workbook = XLSX.read(buffer, { type: "array" });
    
    console.log("All sheet names:", workbook.SheetNames);
    
    // The DM01 Provider file may have multiple sheets. We need the one with
    // per-test (per-modality) breakdown, not the aggregate "Provider" summary.
    // Look for sheets in priority order: per-test sheets first, then provider summary.
    let sheetName = workbook.SheetNames[0];
    let foundPerTestSheet = false;
    
    // Priority 1: Look for a sheet with per-test/per-modality data
    for (const name of workbook.SheetNames) {
      const n = name.toLowerCase();
      if (n.includes("test") || n.includes("modality") || n.includes("by test") || n.includes("procedure")) {
        sheetName = name;
        foundPerTestSheet = true;
        break;
      }
    }
    
    // Priority 2: If no per-test sheet, use the first sheet (which often has detailed data)
    // but NOT the "Provider" summary sheet if alternatives exist
    if (!foundPerTestSheet && workbook.SheetNames.length > 1) {
      // Check if first sheet has more rows than "Provider" sheet - that's likely the detailed one
      for (const name of workbook.SheetNames) {
        const n = name.toLowerCase();
        if (!n.includes("provider") && !n.includes("note") && !n.includes("content")) {
          sheetName = name;
          foundPerTestSheet = true;
          break;
        }
      }
    }
    
    // Priority 3: Fall back to Provider sheet (we'll handle aggregation differently)
    if (!foundPerTestSheet) {
      for (const name of workbook.SheetNames) {
        const n = name.toLowerCase();
        if (n.includes("provider") || n.includes("data") || n.includes("dm01")) {
          sheetName = name;
          break;
        }
      }
    }
    
    const sheet = workbook.Sheets[sheetName];
    
    // NHS XLS files have title rows at the top before the actual data headers.
    // We need to find the row that contains column headers like "Provider Code" etc.
    // Convert to array-of-arrays to scan for the header row.
    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rawRows.length, 30); i++) {
      const cells = rawRows[i].map(c => norm(c));
      // The real header row should have MANY non-empty cells and specific patterns
      const nonEmpty = cells.filter(c => c.length > 0).length;
      const hasProviderCode = cells.some(c => c.includes("provider code") || c.includes("org code") || c.includes("organisation code"));
      const hasWeekBands = cells.some(c => /\d+\s*[-–]\s*\d+/.test(c) || /\d+\s*\+/.test(c));
      const hasTotalWaiting = cells.some(c => c.includes("total waiting") || c.includes("total wl"));
      const hasDiagnostic = cells.some(c => c.includes("diagnostic") || c.includes("test"));
      
      // Require at least 5 non-empty cells AND provider code or (week bands AND total)
      if (nonEmpty >= 5 && (hasProviderCode || (hasWeekBands && (hasTotalWaiting || hasDiagnostic)))) {
        headerRowIdx = i;
        console.log(`Found header row at index ${i}`);
        break;
      }
    }
    
    if (headerRowIdx === -1) {
      return new Response(
        JSON.stringify({ error: "Could not find data header row in spreadsheet" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse using the detected header row
    const headerRow = rawRows[headerRowIdx].map(c => String(c ?? "").trim());
    const rows: Record<string, unknown>[] = [];
    for (let i = headerRowIdx + 1; i < rawRows.length; i++) {
      const row: Record<string, unknown> = {};
      for (let j = 0; j < headerRow.length; j++) {
        const key = headerRow[j] || `col_${j}`;
        row[key] = rawRows[i]?.[j] ?? 0;
      }
      // Skip empty rows
      const hasData = Object.values(row).some(v => v !== "" && v !== 0);
      if (hasData) rows.push(row);
    }
    
    console.log(`Using sheet: ${sheetName}, header row: ${headerRowIdx}, data rows: ${rows.length}, ALL columns: ${headerRow.join(' | ')}`);
    
    // Debug: log first few rows to understand structure
    const pcColIdx = headerRow.findIndex(h => norm(h).includes("provider code") || norm(h).includes("org code"));
    const pcColName = pcColIdx >= 0 ? headerRow[pcColIdx] : headerRow[0];
    const matchingRows = rows.filter(r => String(r[pcColName] ?? "").trim().toUpperCase() === providerCode.toUpperCase());
    console.log(`Total rows matching provider ${providerCode}: ${matchingRows.length}`);
    if (matchingRows.length > 0) {
      console.log("First matching row:", JSON.stringify(Object.fromEntries(Object.entries(matchingRows[0]).slice(0, 10))));
      if (matchingRows.length > 1) {
        console.log("Second matching row:", JSON.stringify(Object.fromEntries(Object.entries(matchingRows[1]).slice(0, 10))));
      }
    }

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
    
    // findCol with exclusion patterns to avoid matching wrong columns
    const findColExclude = (patterns: string[], excludePatterns: string[]) =>
      headers.find((h) => {
        const n = norm(h);
        return patterns.some((p) => n.includes(p)) && !excludePatterns.some((e) => n.includes(e));
      });

    const providerCodeCol =
      findCol(["provider code", "org code", "organisation code"]) ?? headers[0];
    const providerNameCol =
      findCol(["provider name", "org name", "organisation name"]) ?? headers[1];
    
    // "Diagnostic Test Name" must be preferred over "Diagnostic ID"
    const testNameCol =
      findCol(["diagnostic test name", "test name"]) ??
      findColExclude(["diagnostic test", "procedure", "diagnostic"], ["id", "planned", "unscheduled", "waiting list"]) ??
      headers[2];
    
    // Diagnostic ID column (numeric test identifier)
    const diagnosticIdCol = findCol(["diagnostic id"]);

    const totalWaitingCol = findCol(["total waiting", "total wl", "total list"]);
    // Direct "Number waiting 6+ Weeks" column
    const numberWaiting6PlusCol = findCol(["number waiting 6", "waiting 6+"]);
    const numberWaiting13PlusCol = findCol(["number waiting 13", "waiting 13+"]);
    const pctWaiting6PlusCol = findCol(["percentage waiting 6", "percent"]);

    // Waiting-list weekly band columns (look for patterns like "0 <01", "01 <02", … "13+")
    const weekBandCols = headers.filter((h) => {
      const n = norm(h);
      return /\d+\s*[<>]\s*\d+/.test(n) || /\d+\s*[-–]\s*\d+/.test(n) || /\d+\s*\+/.test(n);
    });

    // Activity: prefer "planned tests / procedures" column
    const activityCol = findCol(["planned tests", "total activity", "activity"]);

    console.log("Detected columns:", {
      providerCodeCol,
      providerNameCol,
      testNameCol,
      diagnosticIdCol,
      totalWaitingCol,
      numberWaiting6PlusCol,
      pctWaiting6PlusCol,
      weekBandCols: weekBandCols.length,
      activityCol,
    });

    // ── 5. Filter rows for the requested provider ───────────────
    // Exclude total/summary rows: if there's a Diagnostic ID column, filter out
    // rows where the test name looks like a total (e.g. "Total" or blank)
    const providerRows = rows.filter((r) => {
      const code = String(r[providerCodeCol] ?? "").trim().toUpperCase();
      if (code !== providerCode.toUpperCase()) return false;
      
      // Exclude total/aggregate rows
      const testName = String(r[testNameCol] ?? "").trim().toLowerCase();
      if (testName === "total" || testName === "all" || testName === "") return false;
      
      return true;
    });

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
      
      // Use Diagnostic ID as a stable code if available, otherwise derive from name
      let testCode: string;
      if (diagnosticIdCol && r[diagnosticIdCol] !== undefined && r[diagnosticIdCol] !== "") {
        testCode = String(toNum(r[diagnosticIdCol]));
      } else {
        testCode = testName
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .split(/\s+/)
          .slice(0, 3)
          .map((w) => w.charAt(0).toUpperCase())
          .join("") || "UNK";
      }

      // Total waiting list
      let totalWaiting = Math.round(totalWaitingCol ? toNum(r[totalWaitingCol]) : 0);
      if (!totalWaiting && weekBandCols.length) {
        totalWaiting = Math.round(weekBandCols.reduce((s, c) => s + toNum(r[c]), 0));
      }

      // 6+ weeks waiting - prefer direct column, fall back to percentage calculation
      let waiting6Plus = numberWaiting6PlusCol ? Math.round(toNum(r[numberWaiting6PlusCol])) : 0;
      
      // Percentage waiting 6+ weeks - prefer direct column
      let pct = pctWaiting6PlusCol ? toNum(r[pctWaiting6PlusCol]) : 0;
      // NHS stores as decimal (0.28 = 28%), convert to percentage
      if (pct > 0 && pct < 1) pct = Math.round(pct * 10000) / 100;
      
      // If we don't have the direct column, calculate
      if (!waiting6Plus && totalWaiting > 0 && pct > 0) {
        waiting6Plus = Math.round(totalWaiting * pct / 100);
      }
      if (!pct && totalWaiting > 0 && waiting6Plus > 0) {
        pct = Math.round((waiting6Plus / totalWaiting) * 10000) / 100;
      }

      const activity = activityCol ? Math.round(toNum(r[activityCol])) : 0;

      return {
        test_code: testCode,
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
        source: "NHS England DM01",
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
