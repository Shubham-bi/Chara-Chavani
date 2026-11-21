using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Expenses.Commands;
using CharaChhavani.Application.Expenses.DTOs;
using CharaChhavani.Application.Expenses.Queries;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ExpensesController : BaseApiController
{
    private readonly IMediator _mediator;

    public ExpensesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Record operational expense (labour, water, electricity, transportation, etc.).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExpenseDto>>> RecordExpense(
        [FromBody] RecordExpenseCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? StatusCode(201, response) : BadRequest(response);
    }

    /// <summary>
    /// Get camp operational expenses summary and category breakdown.
    /// </summary>
    [HttpGet("camp/{campId:long}")]
    public async Task<ActionResult<ApiResponse<CampExpenseSummaryDto>>> GetCampExpenses(
        [FromRoute] long campId)
    {
        var response = await _mediator.Send(new GetCampExpensesQuery(campId));
        return Ok(response);
    }
}
