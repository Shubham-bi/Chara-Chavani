/**
 * ReportingHelper: Formats structured audit logs and execution metrics
 * for automated QA runs and compliance records.
 */
export class ReportingHelper {
  private static stepCount = 0;

  /**
   * Log a structured test step with timestamp.
   */
  public static logStep(stepName: string, details?: any): void {
    this.stepCount++;
    const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
    const prefix = `[STEP ${this.stepCount}] [${timestamp}]`;
    if (details) {
      console.log(`${prefix} ${stepName}:`, typeof details === 'object' ? JSON.stringify(details) : details);
    } else {
      console.log(`${prefix} ${stepName}`);
    }
  }

  /**
   * Reset the step counter.
   */
  public static resetSteps(): void {
    this.stepCount = 0;
  }

  /**
   * Log data-driven iteration context.
   */
  public static logDataIteration(suiteName: string, index: number, total: number, rowData: any): void {
    console.log(
      `📊 [${suiteName}] Iteration ${index + 1}/${total} | Input:`,
      JSON.stringify(rowData)
    );
  }

  /**
   * Print formatted summary banner.
   */
  public static printSummary(suiteName: string, passed: number, total: number): void {
    console.log('\n========================================================');
    console.log(`  SUITE SUMMARY: ${suiteName}`);
    console.log(`  Passed: ${passed} / ${total} (${((passed / total) * 100).toFixed(1)}%)`);
    console.log('========================================================\n');
  }
}
