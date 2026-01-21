SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

CREATE TABLE `appointments` (
  `TerminID` int(11) NOT NULL AUTO_INCREMENT,
  `TeamID` int(11) NOT NULL,
  `ZuletztGeaendert` int(11) NOT NULL,
  `Datum` datetime NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Fach` varchar(255) NOT NULL,
  `Lehrer` varchar(255) NOT NULL,
  `Notizen` text DEFAULT NULL,
  PRIMARY KEY (`TerminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `changes` (
  `AenderungsID` int(11) NOT NULL AUTO_INCREMENT,
  `Timestamp` datetime NOT NULL,
  `ZuletztGeaendert` int(11) NOT NULL,
  `TerminID` int(11) NOT NULL,
  `Datum` datetime NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Fach` varchar(255) NOT NULL,
  `Lehrer` varchar(255) NOT NULL,
  `Notizen` text DEFAULT NULL,
  PRIMARY KEY (`AenderungsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `session` (
  `Token` varchar(255) NOT NULL,
  `NutzerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `session`
  ADD PRIMARY KEY (`Token`) USING BTREE;

CREATE TABLE `teams` (
  `TeamID` int(11) NOT NULL AUTO_INCREMENT,
  `TeamName` varchar(255) NOT NULL,
  `Mitglieder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Mitglieder`)),
  `Klassensprecher` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Klassensprecher`)),
  PRIMARY KEY (`TeamID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Mail` varchar(255) NOT NULL,
  `Passwort` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Lehrer` tinyint(1) NOT NULL,
  `Admin` tinyint(1) NOT NULL,
  `online` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `push_subscriptions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Subscription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Subscription`)),
  `NutzerID` int(11) NOT NULL,
  PRIMARY KEY(`ID`),
  UNIQUE(`Subscription`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `grades` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SchuelerID` int(11) NOT NULL,
  `LehrerID` int(11) NOT NULL,
  `Fach` varchar(255) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `Note` int(11) DEFAULT NULL,
  PRIMARY KEY(`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


COMMIT;

