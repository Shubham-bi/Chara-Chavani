using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Chhavanis.Commands;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Chhavanis.Queries;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CampsController : BaseApiController
{
    private readonly IMediator _mediator;

    public CampsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Register a new Chara Chhavani (Camp) with capacity and operator.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ChhavaniDto>>> CreateCamp([FromBody] CreateChhavaniCommand command)
    {
        var response = await _mediator.Send(command);
        return StatusCode(response.Success ? 201 : 400, response);
    }

    /// <summary>
    /// Set or update the closed polygon geofence boundary for a camp.
    /// </summary>
    [HttpPut("{id:long}/geofence")]
    public async Task<ActionResult<ApiResponse<ChhavaniDto>>> UpdateGeofence(
        [FromRoute] long id,
        [FromBody] List<GeoCoordinateDto> coordinates)
    {
        var command = new UpdateChhavaniGeofenceCommand
        {
            ChhavaniId = id,
            GeofenceCoordinates = coordinates
        };
        var response = await _mediator.Send(command);
        return Ok(response);
    }

    /// <summary>
    /// Get camp details including geofence polygon vertices and live capacity.
    /// </summary>
    [HttpGet("{id:long}")]
    public async Task<ActionResult<ApiResponse<ChhavaniDto>>> GetCampById([FromRoute] long id)
    {
        var response = await _mediator.Send(new GetChhavaniByIdQuery(id));
        return Ok(response);
    }

    /// <summary>
    /// List camps with optional filters for district, taluka, and status.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ChhavaniDto>>>> GetCamps(
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] CampStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetChhavanisQuery
        {
            District = district,
            Taluka = taluka,
            Status = status,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Validate whether a device GPS coordinate is inside the camp geofence.
    /// </summary>
    [HttpGet("{id:long}/validate-point")]
    public async Task<ActionResult<ApiResponse<GeofenceValidationResultDto>>> ValidatePoint(
        [FromRoute] long id,
        [FromQuery] double latitude,
        [FromQuery] double longitude)
    {
        var response = await _mediator.Send(new ValidateCampGeofenceQuery(id, latitude, longitude));
        return Ok(response);
    }
}
