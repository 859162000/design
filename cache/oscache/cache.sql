/*
Navicat MySQL Data Transfer

Source Server         : Study
Source Server Version : 50519
Source Host           : localhost:3306
Source Database       : cache

Target Server Type    : MYSQL
Target Server Version : 50519
File Encoding         : 65001

Date: 2016-02-29 18:12:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `sex` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '张三', '12', '男', '北京', '0');
INSERT INTO `user` VALUES ('2', '张三1', '12', '男', '上海', '0');
INSERT INTO `user` VALUES ('3', '张三2', '18', '男', '北京', '0');
INSERT INTO `user` VALUES ('4', '张三3', '22', '男', '上海', '0');
INSERT INTO `user` VALUES ('5', '张三4', '32', '女', '北京', '0');
INSERT INTO `user` VALUES ('6', '张三5', '72', '男', '上海', '0');
INSERT INTO `user` VALUES ('7', '张三6', '52', '女', '北京', '0');
INSERT INTO `user` VALUES ('8', '张三7', '62', '男', '北京', '0');
INSERT INTO `user` VALUES ('9', '张三8', '18', '女', '上海', '0');
INSERT INTO `user` VALUES ('10', '张三9', '28', '男', '北京', '0');
INSERT INTO `user` VALUES ('11', '张三10', '31', '男', '北京', '0');
INSERT INTO `user` VALUES ('12', '张三11', '22', '女', '上海', '0');
INSERT INTO `user` VALUES ('13', '张三12', '16', '男', '北京', '0');
INSERT INTO `user` VALUES ('14', '张三13', '31', '女', '上海', '0');
INSERT INTO `user` VALUES ('15', '李四1', '12', '男', '广州', '0');
INSERT INTO `user` VALUES ('16', '李四2', '18', '男', '深圳', '0');
INSERT INTO `user` VALUES ('17', '李四3', '22', '男', '广州', '0');
INSERT INTO `user` VALUES ('18', '李四4', '32', '女', '深圳', '0');
INSERT INTO `user` VALUES ('19', '李四5', '72', '男', '广州', '0');
INSERT INTO `user` VALUES ('20', '李四6', '52', '女', '深圳', '0');
INSERT INTO `user` VALUES ('21', '李四7', '62', '男', '深圳', '0');
INSERT INTO `user` VALUES ('22', '李四8', '18', '女', '广州', '0');
INSERT INTO `user` VALUES ('23', '李四9', '28', '男', '深圳', '0');
INSERT INTO `user` VALUES ('24', '李四10', '31', '男', '深圳', '0');
INSERT INTO `user` VALUES ('25', '李四11', '22', '女', '广州', '0');
INSERT INTO `user` VALUES ('26', '李四12', '16', '男', '深圳', '0');
INSERT INTO `user` VALUES ('27', '李四13', '31', '女', '广州', '0');
