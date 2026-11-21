CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `chhavanis` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `CampCode` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `Address` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Village` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Taluka` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `District` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Maharashtra',
        `TotalCapacity` int NOT NULL,
        `ActiveAnimalCount` int NOT NULL,
        `Status` int NOT NULL,
        `GeofenceBoundary` polygon NULL,
        `Location` point NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_chhavanis` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `farmers` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `MobileNumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Address` longtext CHARACTER SET utf8mb4 NULL,
        `Village` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Taluka` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `District` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `State` longtext CHARACTER SET utf8mb4 NOT NULL,
        `IsRegisteredSeller` tinyint(1) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_farmers` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `chhavani_operators` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `ChhavaniId` bigint NOT NULL,
        `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `MobileNumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Address` longtext CHARACTER SET utf8mb4 NULL,
        `IsActive` tinyint(1) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_chhavani_operators` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_chhavani_operators_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `expenses` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `ChhavaniId` bigint NOT NULL,
        `Category` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Amount` decimal(18,2) NOT NULL,
        `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
        `ExpenseDate` datetime(6) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_expenses` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_expenses_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `feeding_entries` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `ChhavaniId` bigint NOT NULL,
        `Source` int NOT NULL,
        `AnimalType` int NOT NULL,
        `FodderType` int NOT NULL,
        `QuantityIssued` decimal(18,2) NOT NULL,
        `Unit` longtext CHARACTER SET utf8mb4 NOT NULL,
        `FeedingDateTime` datetime(6) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_feeding_entries` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_feeding_entries_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `fodder_purchases` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `PurchaseCode` longtext CHARACTER SET utf8mb4 NOT NULL,
        `ChhavaniId` bigint NOT NULL,
        `SellerName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `SellerMobile` longtext CHARACTER SET utf8mb4 NULL,
        `SellerFarmerId` bigint NULL,
        `FodderType` int NOT NULL,
        `Quantity` decimal(18,2) NOT NULL,
        `Unit` longtext CHARACTER SET utf8mb4 NOT NULL,
        `RatePerUnit` decimal(18,2) NOT NULL,
        `TotalAmount` decimal(18,2) NOT NULL,
        `PurchaseDate` datetime(6) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_fodder_purchases` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_fodder_purchases_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `fodder_stocks` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `ChhavaniId` bigint NOT NULL,
        `Source` int NOT NULL,
        `FodderType` int NOT NULL,
        `AvailableQuantity` decimal(18,2) NOT NULL,
        `Unit` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'kg',
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_fodder_stocks` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_fodder_stocks_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `stock_adjustments` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `ChhavaniId` bigint NOT NULL,
        `Source` int NOT NULL,
        `FodderType` int NOT NULL,
        `AdjustmentType` int NOT NULL,
        `Quantity` decimal(18,2) NOT NULL,
        `Unit` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Reason` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
        `AdjustmentDate` datetime(6) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_stock_adjustments` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_stock_adjustments_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `animals` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `AnimalCode` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `TagNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
        `FarmerId` bigint NOT NULL,
        `AnimalType` int NOT NULL,
        `Breed` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Gender` int NOT NULL,
        `AgeInMonths` int NOT NULL,
        `PhotoUrl` longtext CHARACTER SET utf8mb4 NULL,
        `VerificationStatus` int NOT NULL,
        `CurrentStatus` int NOT NULL,
        `CurrentChhavaniId` bigint NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_animals` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_animals_chhavanis_CurrentChhavaniId` FOREIGN KEY (`CurrentChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE SET NULL,
        CONSTRAINT `FK_animals_farmers_FarmerId` FOREIGN KEY (`FarmerId`) REFERENCES `farmers` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `animal_admissions` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `AdmissionCode` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `AnimalId` bigint NOT NULL,
        `ChhavaniId` bigint NOT NULL,
        `OperatorId` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `AdmissionPhotoUrl` longtext CHARACTER SET utf8mb4 NULL,
        `AdmissionLocation` point NULL,
        `IsGeofenceValidated` tinyint(1) NOT NULL,
        `AdmittedAtUtc` datetime(6) NOT NULL,
        `ReleasedAtUtc` datetime(6) NULL,
        `ReleaseRemarks` longtext CHARACTER SET utf8mb4 NULL,
        `Status` int NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_animal_admissions` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_animal_admissions_animals_AnimalId` FOREIGN KEY (`AnimalId`) REFERENCES `animals` (`Id`) ON DELETE RESTRICT,
        CONSTRAINT `FK_animal_admissions_chhavanis_ChhavaniId` FOREIGN KEY (`ChhavaniId`) REFERENCES `chhavanis` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE TABLE `vet_verifications` (
        `Id` bigint NOT NULL AUTO_INCREMENT,
        `AnimalId` bigint NOT NULL,
        `DoctorId` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Result` int NOT NULL,
        `Remarks` varchar(500) CHARACTER SET utf8mb4 NULL,
        `VerificationPhotoUrl` longtext CHARACTER SET utf8mb4 NULL,
        `InspectionLocation` point NULL,
        `VerifiedAtUtc` datetime(6) NOT NULL,
        `CreatedAtUtc` datetime(6) NOT NULL,
        `CreatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `UpdatedAtUtc` datetime(6) NULL,
        `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        CONSTRAINT `PK_vet_verifications` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_vet_verifications_animals_AnimalId` FOREIGN KEY (`AnimalId`) REFERENCES `animals` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_animal_admissions_AdmissionCode` ON `animal_admissions` (`AdmissionCode`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_animal_admissions_AnimalId` ON `animal_admissions` (`AnimalId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_animal_admissions_ChhavaniId` ON `animal_admissions` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_animals_AnimalCode` ON `animals` (`AnimalCode`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_animals_CurrentChhavaniId` ON `animals` (`CurrentChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_animals_FarmerId` ON `animals` (`FarmerId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_chhavani_operators_ChhavaniId` ON `chhavani_operators` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_chhavani_operators_MobileNumber` ON `chhavani_operators` (`MobileNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_chhavanis_CampCode` ON `chhavanis` (`CampCode`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_expenses_ChhavaniId` ON `expenses` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_farmers_MobileNumber` ON `farmers` (`MobileNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_feeding_entries_ChhavaniId` ON `feeding_entries` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_fodder_purchases_ChhavaniId` ON `fodder_purchases` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_fodder_stocks_ChhavaniId_Source_FodderType` ON `fodder_stocks` (`ChhavaniId`, `Source`, `FodderType`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_stock_adjustments_ChhavaniId` ON `stock_adjustments` (`ChhavaniId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    CREATE INDEX `IX_vet_verifications_AnimalId` ON `vet_verifications` (`AnimalId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20261121193910_InitialCreate') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20261121193910_InitialCreate', '8.0.11');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

