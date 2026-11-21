using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected ActionResult<ApiResponse<T>> HandleResult<T>(T data, string message = "Success")
    {
        return Ok(ApiResponse<T>.Ok(data, message, HttpContext.TraceIdentifier));
    }
}
