using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Fodder.Commands;
using CharaChhavani.Application.Fodder.DTOs;
using CharaChhavani.Application.Fodder.Queries;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class FodderController : BaseApiController
{
    private readonly IMediator _mediator;

    public FodderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Record fodder purchase entry and atomically increment Store stock.
    /// </summary>
    [HttpPost("purchases")]
    public async Task<ActionResult<ApiResponse<PurchaseRecordResultDto>>> RecordPurchase(
        [FromBody] RecordFodderPurchaseCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? StatusCode(201, response) : BadRequest(response);
    }

    /// <summary>
    /// Get camp inventory overview categorized by Store stock and InFarm stock.
    /// </summary>
    [HttpGet("stock/{campId:long}")]
    public async Task<ActionResult<ApiResponse<CampStockOverviewDto>>> GetCampStock(
        [FromRoute] long campId)
    {
        var response = await _mediator.Send(new GetCampStockOverviewQuery(campId));
        return Ok(response);
    }

    /// <summary>
    /// Record daily group feeding (by animal type) and deduct inventory with non-negative guard.
    /// </summary>
    [HttpPost("feeding")]
    public async Task<ActionResult<ApiResponse<FeedingRecordResultDto>>> RecordFeeding(
        [FromBody] RecordFeedingCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Record stock adjustment (wastage, damage, audit corrections) with mandatory reason.
    /// </summary>
    [HttpPost("adjustments")]
    public async Task<ActionResult<ApiResponse<StockAdjustmentResultDto>>> RecordAdjustment(
        [FromBody] RecordStockAdjustmentCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }
}
