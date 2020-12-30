-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: calorieBuddy
-- ------------------------------------------------------
-- Server version	5.7.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `typicalValue` decimal(5,2) unsigned NOT NULL,
  `unit` varchar(50) NOT NULL,
  `calories` decimal(5,2) unsigned NOT NULL,
  `carbs` decimal(5,2) unsigned NOT NULL,
  `fat` decimal(5,2) unsigned NOT NULL,
  `protein` decimal(5,2) unsigned NOT NULL,
  `salt` decimal(5,2) unsigned NOT NULL,
  `sugar` decimal(5,2) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (21,'Banana',150.00,'g',134.00,34.30,0.50,1.60,0.50,18.30),(31,'Ice Mocha',1.00,'cup',159.00,30.30,2.60,3.90,0.50,24.50),(101,'Milk Chocolate',7.00,'g',37.00,4.20,2.10,0.50,0.05,3.60);
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

-- Dump completed on 2020-12-26 18:28:47
