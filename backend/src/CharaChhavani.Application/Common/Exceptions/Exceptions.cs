using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.Application.Common.Exceptions;

public class BusinessException : Exception
{
    public string Code { get; }

    public BusinessException(string message, string code = "BUSINESS_RULE_VIOLATION") : base(message)
    {
        Code = code;
    }
}

public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.")
    {
    }
}

public class CustomValidationException : Exception
{
    public List<ApiError> Errors { get; }

    public CustomValidationException(List<ApiError> errors) : base("One or more validation failures have occurred.")
    {
        Errors = errors;
    }
}
