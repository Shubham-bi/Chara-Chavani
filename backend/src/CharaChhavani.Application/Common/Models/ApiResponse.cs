namespace CharaChhavani.Application.Common.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<ApiError>? Errors { get; set; }
    public string TraceId { get; set; } = string.Empty;

    public static ApiResponse<T> Ok(T data, string message = "Success", string traceId = "")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            TraceId = traceId
        };
    }

    public static ApiResponse<T> Failure(string message, List<ApiError>? errors = null, string traceId = "")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors,
            TraceId = traceId
        };
    }
}

public class ApiError
{
    public string Field { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public ApiError() { }

    public ApiError(string field, string code, string message)
    {
        Field = field;
        Code = code;
        Message = message;
    }
}
