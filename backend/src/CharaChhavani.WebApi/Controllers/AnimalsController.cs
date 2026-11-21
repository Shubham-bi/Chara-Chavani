using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Animals.Commands;
using CharaChhavani.Application.Animals.DTOs;
using CharaChhavani.Application.Animals.Queries;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AnimalsController : BaseApiController
{
    private readonly IMediator _mediator;

    public AnimalsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Register a new animal under a farmer profile.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AnimalDto>>> RegisterAnimal([FromBody] RegisterAnimalCommand command)
    {
        var response = await _mediator.Send(command);
        return StatusCode(response.Success ? 201 : 400, response);
    }

    /// <summary>
    /// Get detailed view of an animal including verification history.
    /// </summary>
    [HttpGet("{id:long}")]
    public async Task<ActionResult<ApiResponse<AnimalDto>>> GetAnimalById([FromRoute] long id)
    {
        var response = await _mediator.Send(new GetAnimalDetailsQuery(id));
        return Ok(response);
    }

    /// <summary>
    /// Resubmit a rejected animal for veterinary re-inspection after correcting details.
    /// </summary>
    [HttpPut("{id:long}/resubmit")]
    public async Task<ActionResult<ApiResponse<AnimalDto>>> ResubmitAnimal(
        [FromRoute] long id,
        [FromBody] ResubmitAnimalCommand command)
    {
        if (id != command.AnimalId)
        {
            return BadRequest(ApiResponse<AnimalDto>.Failure("Route parameter ID does not match body ID."));
        }

        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }
}
