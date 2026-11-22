using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Admin.Queries;
using CharaChhavani.Application.Admin.Queries.Reports;
using CharaChhavani.Application.Common.Helpers;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AdminController : BaseApiController
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get system-wide KPIs across farmers, cattle, camp capacity, fodder inventory, and government expenditure.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<AdminDashboardSummaryDto>>> GetDashboardSummary()
    {
        var response = await _mediator.Send(new GetAdminDashboardQuery());
        return Ok(response);
    }

    /// <summary>
    /// Get capacity utilization and geofence status across all cattle camps.
    /// </summary>
    [HttpGet("camps-summary")]
    public async Task<ActionResult<ApiResponse<List<CampUtilizationSummaryDto>>>> GetCampsSummary()
    {
        var response = await _mediator.Send(new GetAdminCampsSummaryQuery());
        return Ok(response);
    }

    /// <summary>
    /// Get geographical distribution hierarchy with choropleth colour grading (State -> District -> Taluka -> Village).
    /// </summary>
    [HttpGet("geographic-distribution")]
    public async Task<ActionResult<ApiResponse<GeographicDistributionDto>>> GetGeographicDistribution(
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] string? metric = "camps")
    {
        var response = await _mediator.Send(new GetGeographicDistributionQuery
        {
            District = district,
            Taluka = taluka,
            Metric = metric
        });
        return Ok(response);
    }

    /// <summary>
    /// Get all registered cattle camps as spatial map features with coordinates and exact polygon geofence boundaries.
    /// </summary>
    [HttpGet("camps-map")]
    public async Task<ActionResult<ApiResponse<List<CampMapFeatureDto>>>> GetCampsMap(
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] string? status)
    {
        var response = await _mediator.Send(new GetCampMapFeaturesQuery
        {
            District = district,
            Taluka = taluka,
            Status = status
        });
        return Ok(response);
    }

    /// <summary>
    /// Get dedicated section analytics across camps, animals, veterinary, fodder, and financials.
    /// </summary>
    [HttpGet("analytics/{section}")]
    public async Task<ActionResult<ApiResponse<object>>> GetSectionAnalytics(
        string section,
        [FromQuery] string? district,
        [FromQuery] string? taluka)
    {
        var response = await _mediator.Send(new GetAdminSectionAnalyticsQuery
        {
            Section = section,
            District = district,
            Taluka = taluka
        });
        return Ok(response);
    }

    /// <summary>
    /// Get camp-wise animal admission and release audit report with active days calculation.
    /// </summary>
    [HttpGet("reports/admissions")]
    public async Task<ActionResult<ApiResponse<List<AdmissionAuditReportItemDto>>>> GetAdmissionReport(
        [FromQuery] long? campId,
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] AdmissionStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetAdmissionAuditReportQuery
        {
            ChhavaniId = campId,
            District = district,
            Taluka = taluka,
            StartDate = startDate,
            EndDate = endDate,
            Status = status,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Get fodder stock reconciliation report comparing purchases, feeding, wastage and current inventory.
    /// </summary>
    [HttpGet("reports/fodder-reconciliation")]
    public async Task<ActionResult<ApiResponse<List<FodderReconciliationReportItemDto>>>> GetFodderReconciliationReport(
        [FromQuery] long? campId,
        [FromQuery] string? district,
        [FromQuery] string? taluka)
    {
        var query = new GetFodderReconciliationReportQuery
        {
            ChhavaniId = campId,
            District = district,
            Taluka = taluka
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Get itemized operational expenses audit report for government subsidy verification.
    /// </summary>
    [HttpGet("reports/expenses")]
    public async Task<ActionResult<ApiResponse<List<ExpenseAuditReportItemDto>>>> GetExpenseReport(
        [FromQuery] long? campId,
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] string? category,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetExpenseAuditReportQuery
        {
            ChhavaniId = campId,
            District = district,
            Taluka = taluka,
            Category = category,
            StartDate = startDate,
            EndDate = endDate,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Get government officer spot inspection audit report with headcount discrepancy detection.
    /// </summary>
    [HttpGet("reports/inspections")]
    public async Task<ActionResult<ApiResponse<List<InspectionAuditReportItemDto>>>> GetInspectionReport(
        [FromQuery] long? campId,
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetInspectionAuditReportQuery
        {
            ChhavaniId = campId,
            District = district,
            Taluka = taluka,
            StartDate = startDate,
            EndDate = endDate,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Export report data as an RFC 4180 CSV file with UTF-8 BOM encoding.
    /// </summary>
    [HttpGet("reports/export")]
    public async Task<IActionResult> ExportReport(
        [FromQuery] string reportType,
        [FromQuery] long? campId,
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        byte[] csvBytes;
        string fileName;

        switch (reportType.ToLower())
        {
            case "admissions":
                var admRes = await _mediator.Send(new GetAdmissionAuditReportQuery
                {
                    ChhavaniId = campId,
                    District = district,
                    Taluka = taluka,
                    StartDate = startDate,
                    EndDate = endDate,
                    PageSize = 10000
                });
                csvBytes = CsvExportHelper.GenerateCsvBytes(admRes.Data ?? new());
                fileName = $"Admissions_Audit_Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                break;

            case "fodder":
                var fodRes = await _mediator.Send(new GetFodderReconciliationReportQuery
                {
                    ChhavaniId = campId,
                    District = district,
                    Taluka = taluka
                });
                csvBytes = CsvExportHelper.GenerateCsvBytes(fodRes.Data ?? new());
                fileName = $"Fodder_Reconciliation_Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                break;

            case "expenses":
                var expRes = await _mediator.Send(new GetExpenseAuditReportQuery
                {
                    ChhavaniId = campId,
                    District = district,
                    Taluka = taluka,
                    StartDate = startDate,
                    EndDate = endDate,
                    PageSize = 10000
                });
                csvBytes = CsvExportHelper.GenerateCsvBytes(expRes.Data ?? new());
                fileName = $"Expense_Audit_Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                break;

            case "inspections":
                var inspRes = await _mediator.Send(new GetInspectionAuditReportQuery
                {
                    ChhavaniId = campId,
                    District = district,
                    Taluka = taluka,
                    StartDate = startDate,
                    EndDate = endDate,
                    PageSize = 10000
                });
                csvBytes = CsvExportHelper.GenerateCsvBytes(inspRes.Data ?? new());
                fileName = $"Inspection_Audit_Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                break;

            default:
                return BadRequest(ApiResponse<object>.Failure($"Invalid reportType: '{reportType}'. Supported: admissions, fodder, expenses, inspections."));
        }

        return File(csvBytes, "text/csv; charset=utf-8", fileName);
    }
}
