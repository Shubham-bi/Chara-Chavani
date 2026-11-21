using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Animals.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Animals.Commands;

// 1. Register Animal Command
public record RegisterAnimalCommand : IRequest<ApiResponse<AnimalDto>>
{
    public long FarmerId { get; init; }
    public AnimalType AnimalType { get; init; }
    public string Breed { get; init; } = string.Empty;
    public Gender Gender { get; init; }
    public int AgeInMonths { get; init; }
    public string? TagNumber { get; init; }
    public string? PhotoUrl { get; init; }
}

public class RegisterAnimalValidator : AbstractValidator<RegisterAnimalCommand>
{
    public RegisterAnimalValidator()
    {
        RuleFor(x => x.FarmerId).GreaterThan(0);
        RuleFor(x => x.Breed).NotEmpty().MaximumLength(100);
        RuleFor(x => x.AgeInMonths).GreaterThan(0).WithMessage("Age must be greater than zero months.");
        RuleFor(x => x.PhotoUrl).NotEmpty().WithMessage("Animal photograph is mandatory for registration.");
    }
}

public class RegisterAnimalCommandHandler : IRequestHandler<RegisterAnimalCommand, ApiResponse<AnimalDto>>
{
    private readonly IApplicationDbContext _context;

    public RegisterAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AnimalDto>> Handle(RegisterAnimalCommand request, CancellationToken cancellationToken)
    {
        var farmer = await _context.Farmers.FirstOrDefaultAsync(f => f.Id == request.FarmerId, cancellationToken);
        if (farmer == null)
        {
            throw new NotFoundException(nameof(Farmer), request.FarmerId);
        }

        // Generate unique AnimalCode: ANM-YYYYMMDD-XXXX
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randSuffix = new Random().Next(1000, 9999);
        var animalCode = $"ANM-{datePart}-{randSuffix}";

        // Optional check for tag number duplicates if provided
        if (!string.IsNullOrWhiteSpace(request.TagNumber))
        {
            var tagExists = await _context.Animals
                .AnyAsync(a => a.TagNumber == request.TagNumber && !a.IsDeleted, cancellationToken);
            if (tagExists)
            {
                return ApiResponse<AnimalDto>.Failure(
                    $"An animal with tag number '{request.TagNumber}' is already registered in the system.");
            }
        }

        var animal = new Animal
        {
            AnimalCode = animalCode,
            TagNumber = request.TagNumber,
            FarmerId = farmer.Id,
            AnimalType = request.AnimalType,
            Breed = request.Breed,
            Gender = request.Gender,
            AgeInMonths = request.AgeInMonths,
            PhotoUrl = request.PhotoUrl,
            VerificationStatus = VerificationStatus.Pending,
            CurrentStatus = AnimalStatus.Registered
        };

        _context.Animals.Add(animal);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = new AnimalDto
        {
            Id = animal.Id,
            AnimalCode = animal.AnimalCode,
            TagNumber = animal.TagNumber,
            FarmerId = animal.FarmerId,
            FarmerName = farmer.Name,
            AnimalType = animal.AnimalType.ToString(),
            Breed = animal.Breed,
            Gender = animal.Gender.ToString(),
            AgeInMonths = animal.AgeInMonths,
            PhotoUrl = animal.PhotoUrl,
            VerificationStatus = animal.VerificationStatus.ToString(),
            CurrentStatus = animal.CurrentStatus.ToString(),
            RegistrationDateUtc = animal.CreatedAtUtc
        };

        return ApiResponse<AnimalDto>.Ok(dto, "Animal registered successfully and queued for veterinary inspection.");
    }
}

// 2. Resubmit Rejected Animal Command
public record ResubmitAnimalCommand : IRequest<ApiResponse<AnimalDto>>
{
    public long AnimalId { get; init; }
    public string Breed { get; init; } = string.Empty;
    public int AgeInMonths { get; init; }
    public string? TagNumber { get; init; }
    public string? PhotoUrl { get; init; }
}

public class ResubmitAnimalValidator : AbstractValidator<ResubmitAnimalCommand>
{
    public ResubmitAnimalValidator()
    {
        RuleFor(x => x.AnimalId).GreaterThan(0);
        RuleFor(x => x.Breed).NotEmpty().MaximumLength(100);
        RuleFor(x => x.AgeInMonths).GreaterThan(0);
    }
}

public class ResubmitAnimalCommandHandler : IRequestHandler<ResubmitAnimalCommand, ApiResponse<AnimalDto>>
{
    private readonly IApplicationDbContext _context;

    public ResubmitAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AnimalDto>> Handle(ResubmitAnimalCommand request, CancellationToken cancellationToken)
    {
        var animal = await _context.Animals
            .Include(a => a.Farmer)
            .FirstOrDefaultAsync(a => a.Id == request.AnimalId, cancellationToken);

        if (animal == null)
        {
            throw new NotFoundException(nameof(Animal), request.AnimalId);
        }

        if (animal.VerificationStatus != VerificationStatus.Rejected)
        {
            return ApiResponse<AnimalDto>.Failure("Only rejected animals can be resubmitted for veterinary verification.");
        }

        animal.Breed = request.Breed;
        animal.AgeInMonths = request.AgeInMonths;
        if (!string.IsNullOrWhiteSpace(request.TagNumber)) animal.TagNumber = request.TagNumber;
        if (!string.IsNullOrWhiteSpace(request.PhotoUrl)) animal.PhotoUrl = request.PhotoUrl;

        // Reset to Pending
        animal.VerificationStatus = VerificationStatus.Pending;
        animal.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new AnimalDto
        {
            Id = animal.Id,
            AnimalCode = animal.AnimalCode,
            TagNumber = animal.TagNumber,
            FarmerId = animal.FarmerId,
            FarmerName = animal.Farmer?.Name ?? "",
            AnimalType = animal.AnimalType.ToString(),
            Breed = animal.Breed,
            Gender = animal.Gender.ToString(),
            AgeInMonths = animal.AgeInMonths,
            PhotoUrl = animal.PhotoUrl,
            VerificationStatus = animal.VerificationStatus.ToString(),
            CurrentStatus = animal.CurrentStatus.ToString(),
            RegistrationDateUtc = animal.CreatedAtUtc
        };

        return ApiResponse<AnimalDto>.Ok(dto, "Animal details updated and resubmitted for verification.");
    }
}
