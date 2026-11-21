using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Admissions.Commands;
using CharaChhavani.Application.Admissions.DTOs;
using CharaChhavani.Application.Admissions.Queries;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AdmissionsController : BaseApiController
{
    private readonly IMediator _mediator;

    public AdmissionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Search animals for admission using Animal Code, Tag Number, or Farmer Mobile.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<List<AnimalAdmissionSearchDto>>>> SearchAnimals(
        [FromQuery] string searchTerm)
    {
        var response = await _mediator.Send(new SearchAnimalForAdmissionQuery(searchTerm));
        return Ok(response);
    }

    /// <summary>
    /// Admit an approved animal to the Chara Chhavani with live photograph and GPS polygon geofence validation.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AdmissionResultDto>>> AdmitAnimal(
        [FromBody] AdmitAnimalCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? StatusCode(201, response) : BadRequest(response);
    }

    /// <summary>
    /// List admissions for a specific Chara Chhavani.
    /// </summary>
    [HttpGet("camp/{campId:long}")]
    public async Task<ActionResult<ApiResponse<List<AdmissionResultDto>>>> GetCampAdmissions(
        [FromRoute] long campId,
        [FromQuery] AdmissionStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetCampAdmissionsQuery
        {
            ChhavaniId = campId,
            Status = status,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Release an animal from the Chara Chhavani and update occupancy.
    /// </summary>
    [HttpPost("{id:long}/release")]
    public async Task<ActionResult<ApiResponse<ReleaseResultDto>>> ReleaseAnimal(
        [FromRoute] long id,
        [FromBody] ReleaseAnimalRequest request)
    {
        var command = new ReleaseAnimalCommand
        {
            AdmissionId = id,
            OperatorId = request.OperatorId,
            Remarks = request.Remarks
        };
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }
}

public class ReleaseAnimalRequest
{
    public string OperatorId { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}
