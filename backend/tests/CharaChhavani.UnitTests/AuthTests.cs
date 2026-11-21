using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Auth.Commands;

namespace CharaChhavani.UnitTests;

public class AuthTests
{
    [Theory]
    [InlineData("9890123456", true)]
    [InlineData("8123456789", true)]
    [InlineData("7028123456", true)]
    [InlineData("5123456789", false)] // Invalid starting digit for Indian mobile
    [InlineData("989012", false)]       // Less than 10 digits
    [InlineData("abcdefghij", false)]   // Non-numeric
    public void SendMobileOtpCommandValidator_ValidatesMobileNumberFormat(string mobile, bool isValid)
    {
        var validator = new SendMobileOtpCommandValidator();
        var command = new SendMobileOtpCommand(mobile, "Farmer");

        var result = validator.Validate(command);
        result.IsValid.Should().Be(isValid);
    }

    [Fact]
    public void AdminLoginCommandValidator_EmptyCredentials_FailsValidation()
    {
        var validator = new AdminLoginCommandValidator();
        var command = new AdminLoginCommand("", "");

        var result = validator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Username");
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }

    [Theory]
    [InlineData("admin", "Admin@123", true)]
    [InlineData("admin", "NewPassword@123", true)]
    [InlineData("admin", "WrongPassword", false)]
    [InlineData("hacker", "Admin@123", false)]
    public async Task AdminLoginCommandHandler_ValidatesAdminCredentials(string username, string password, bool shouldSucceed)
    {
        var handler = new AdminLoginCommandHandler();
        var command = new AdminLoginCommand(username, password);

        if (shouldSucceed)
        {
            var response = await handler.Handle(command, CancellationToken.None);
            response.Should().NotBeNull();
            response.Username.Should().Be(username);
            response.Role.Should().Be("Admin");
            response.Token.Should().StartWith("ey-admin-token-");
        }
        else
        {
            var act = () => handler.Handle(command, CancellationToken.None);
            await act.Should().ThrowAsync<FluentValidation.ValidationException>();
        }
    }
}
