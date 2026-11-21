using CharaChhavani.Application.MasterData.DTOs;

namespace CharaChhavani.Application.Common.Interfaces;

public interface IDatabaseSeeder
{
    Task<SeedResultDto> SeedAsync(CancellationToken cancellationToken = default);
}
