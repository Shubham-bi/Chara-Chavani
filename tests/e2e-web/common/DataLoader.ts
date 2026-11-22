import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

/**
 * DataLoader: Unified utility to parse and supply data-driven test inputs
 * from both JSON and Excel (.xlsx) files.
 */
export class DataLoader {
  private static readonly baseDataDir = path.resolve(__dirname, '../../../tests/fixtures/data');
  private static cache: Map<string, any> = new Map();

  /**
   * Resolve an absolute path for a data file name or relative path.
   */
  public static resolveDataPath(fileName: string): string {
    if (path.isAbsolute(fileName)) {
      return fileName;
    }
    return path.join(this.baseDataDir, fileName);
  }

  /**
   * Load and parse a JSON dataset.
   * @param fileName File name inside tests/fixtures/data or relative path
   */
  public static loadJson<T = any>(fileName: string): T {
    const fullPath = this.resolveDataPath(fileName);
    if (this.cache.has(fullPath)) {
      return this.cache.get(fullPath) as T;
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`DataLoader: JSON file not found at ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(content) as T;
    this.cache.set(fullPath, parsed);
    return parsed;
  }

  /**
   * Load and parse an Excel (.xlsx) spreadsheet as typed array of row objects.
   * @param fileName File name or relative path
   * @param sheetName Optional sheet name; defaults to first sheet
   */
  public static loadExcel<T = any>(fileName: string, sheetName?: string): T[] {
    const fullPath = this.resolveDataPath(fileName);
    const cacheKey = `${fullPath}:${sheetName || '__default__'}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T[];
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`DataLoader: Excel workbook not found at ${fullPath}`);
    }

    const workbook = XLSX.readFile(fullPath);
    const targetSheetName = sheetName || workbook.SheetNames[0];

    if (!workbook.Sheets[targetSheetName]) {
      throw new Error(
        `DataLoader: Sheet "${targetSheetName}" not found in workbook. Available sheets: ${workbook.SheetNames.join(', ')}`
      );
    }

    const worksheet = workbook.Sheets[targetSheetName];
    const rows = XLSX.utils.sheet_to_json<T>(worksheet, { defval: '' });
    this.cache.set(cacheKey, rows);
    return rows;
  }

  /**
   * Get list of sheet names from an Excel workbook.
   */
  public static getExcelSheetNames(fileName: string): string[] {
    const fullPath = this.resolveDataPath(fileName);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`DataLoader: Excel workbook not found at ${fullPath}`);
    }
    const workbook = XLSX.readFile(fullPath);
    return workbook.SheetNames;
  }

  /**
   * Create or write an Excel file containing multiple sheets.
   */
  public static writeExcel(fileName: string, sheets: Record<string, any[]>): string {
    const fullPath = this.resolveDataPath(fileName);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = XLSX.utils.book_new();
    for (const [sName, sData] of Object.entries(sheets)) {
      const worksheet = XLSX.utils.json_to_sheet(sData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sName);
    }

    XLSX.writeFile(workbook, fullPath);
    return fullPath;
  }

  /**
   * Clear in-memory parsed cache.
   */
  public static clearCache(): void {
    this.cache.clear();
  }
}
