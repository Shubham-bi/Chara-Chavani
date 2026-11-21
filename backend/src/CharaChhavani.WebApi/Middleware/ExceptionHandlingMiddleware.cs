using System.Net;
using System.Text.Json;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = context.TraceIdentifier;
        var statusCode = HttpStatusCode.InternalServerError;
        var message = "An unexpected server error occurred.";
        List<ApiError>? errors = null;

        switch (exception)
        {
            case CustomValidationException valEx:
                statusCode = HttpStatusCode.BadRequest;
                message = "Validation failed.";
                errors = valEx.Errors;
                break;

            case FluentValidation.ValidationException fvEx:
                statusCode = HttpStatusCode.BadRequest;
                message = "Validation failed.";
                errors = fvEx.Errors.Select(e => new ApiError(e.PropertyName, "VALIDATION_ERROR", e.ErrorMessage)).ToList();
                break;

            case NotFoundException notFoundEx:
                statusCode = HttpStatusCode.NotFound;
                message = notFoundEx.Message;
                break;

            case BusinessException bizEx:
                statusCode = HttpStatusCode.UnprocessableEntity;
                message = bizEx.Message;
                errors = new List<ApiError> { new ApiError("businessRule", bizEx.Code, bizEx.Message) };
                break;

            default:
                _logger.LogError(exception, "Unhandled Exception caught in global middleware. TraceId: {TraceId}", traceId);
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Failure(message, errors, traceId);
        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
