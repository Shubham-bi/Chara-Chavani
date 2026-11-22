using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Infrastructure.Common;
using CharaChhavani.Infrastructure.Persistence;

namespace CharaChhavani.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Load credentials from backend/.env if present
        EnvLoader.Load();

        var envUser = EnvLoader.Get("USERNAME") ?? "root";
        var envPass = EnvLoader.Get("PASSWORD") ?? "NewPassword@123";

        var baseConnectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Port=3306;Database=chara_chhavani_db;CharSet=utf8mb4;";

        var builder = new MySqlConnectionStringBuilder(baseConnectionString)
        {
            UserID = envUser,
            Password = envPass,
            TreatTinyAsBoolean = true
        };

        var connectionString = builder.ConnectionString;
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 42));

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            // Pomelo MySQL with NetTopologySuite plugin for GIS
            options.UseMySql(
                connectionString,
                serverVersion,
                mySqlOptions =>
                {
                    mySqlOptions.UseNetTopologySuite();
                    mySqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorNumbersToAdd: null);
                });
        });

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

        return services;
    }
}
