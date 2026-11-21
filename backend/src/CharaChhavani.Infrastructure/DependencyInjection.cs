using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Infrastructure.Persistence;

namespace CharaChhavani.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=localhost;Database=chara_chhavani_db;User=root;Password=password;";

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

        return services;
    }
}
