-- CreateTable
CREATE TABLE `Contribuicao` (
    `IdContribuicao` INTEGER NOT NULL AUTO_INCREMENT,
    `DataContribuicao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Quantidade` INTEGER NOT NULL,
    `TipoDoacao` VARCHAR(10) NOT NULL,
    `Gastos` INTEGER NOT NULL,
    `Meta` INTEGER NULL,
    `Fonte` VARCHAR(200) NULL,
    `Comprovante` VARCHAR(200) NULL,
    `RaUsuario` INTEGER NULL,

    INDEX `RaUsuario`(`RaUsuario`),
    PRIMARY KEY (`IdContribuicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentor` (
    `IdMentor` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(250) NOT NULL,
    `IsAdm` BOOLEAN NULL,

    PRIMARY KEY (`IdMentor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time` (
    `IdTime` INTEGER NOT NULL AUTO_INCREMENT,
    `NomeTime` VARCHAR(250) NOT NULL,
    `IdMentor` INTEGER NULL,
    `RaUsuario` INTEGER NULL,
    `RaAlunos` INTEGER NULL,

    INDEX `IdMentor`(`IdMentor`),
    INDEX `RaUsuario`(`RaUsuario`),
    PRIMARY KEY (`IdTime`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `RaUsuario` INTEGER NOT NULL,
    `NomeUsuario` VARCHAR(250) NOT NULL,
    `EmailUsuario` VARCHAR(250) NOT NULL,
    `SenhaUsuario` VARCHAR(16) NOT NULL,
    `Turma` VARCHAR(20) NOT NULL,
    `TelefoneUsuario` VARCHAR(20) NULL,

    PRIMARY KEY (`RaUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
