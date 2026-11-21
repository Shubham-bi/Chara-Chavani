using MediatR;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.MasterData.DTOs;

namespace CharaChhavani.Application.MasterData.Commands;

public record SeedDatabaseCommand : IRequest<SeedResultDto>;

public class SeedDatabaseCommandHandler : IRequestHandler<SeedDatabaseCommand, SeedResultDto>
{
    private readonly IDatabaseSeeder _seeder;

    public SeedDatabaseCommandHandler(IDatabaseSeeder seeder)
    {
        _seeder = seeder;
    }

    public Task<SeedResultDto> Handle(SeedDatabaseCommand request, CancellationToken cancellationToken)
    {
        return _seeder.SeedAsync(cancellationToken);
    }
}
