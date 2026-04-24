import Papa from "papaparse";

const SPREADSHEET_ID = "2PACX-1vRWLOoi3kqOgbfZXmd4H60vyO2Wk6MrHQJTin-mlxkXcuzipiJfQ5ASGiiUp2MZqEdoMo5-yKuVtsK1";

export interface SheetData {
  [key: string]: any;
}

/**
 * Fetches and parses a Google Sheet published as CSV.
 * @param gid The Grid ID of the specific sheet.
 * @returns A promise that resolves to an array of objects representing the rows.
 */
export async function fetchSheetData(gid: string): Promise<SheetData[]> {
  const url = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pub?gid=${gid}&single=true&output=csv`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically converts numbers/booleans
        complete: (results) => {
          resolve(results.data as SheetData[]);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error(`Error fetching sheet with GID ${gid}:`, error);
    return [];
  }
}

/**
 * Fetches multiple sheets in parallel.
 * @param sheets An object where keys are sheet names and values are GIDs.
 */
export async function fetchAllSheets(sheets: Record<string, string>) {
  const fetchPromises = Object.entries(sheets).map(async ([name, gid]) => {
    const data = await fetchSheetData(gid);
    return { name, data };
  });

  const results = await Promise.all(fetchPromises);
  
  return results.reduce((acc, { name, data }) => {
    acc[name] = data;
    return acc;
  }, {} as Record<string, SheetData[]>);
}
