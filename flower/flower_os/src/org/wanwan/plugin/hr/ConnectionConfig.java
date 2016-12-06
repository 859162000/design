package org.wanwan.plugin.hr;

import java.util.Properties;

@SuppressWarnings("serial")
public class ConnectionConfig extends Properties {
	/**
	 * 数据源1 sqlserver
	 */
	// private static String sqlServerDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	// private static String sqlServerUrl = "jdbc:sqlserver://10.132.21.18:1433;DatabaseName=Issue_Test";
	public static String sqlServerUser;
	public static String sqlServerPassword;

	/**
	 * 数据源1.2 jtds
	 */
	public static String jtdsDriver;
	public static String jtdsUrl;

	/**
	 * 数据源2 oracle
	 */
	public static String oracleDriver;
	public static String oracleUrl; // 127.0.0.1是本机地址，XE是精简版Oracle的默认数据库名
	public static String oracleUser;// 用户名,系统默认的账户名
	public static String oraclePssword;// 你安装时选设置的密码

	/**
	 * sqlserver查询表数据sql语句
	 */
	public static String query_user;
	public static String query_dept;
	public static String query_branch;

	/**
	 * oracle删除旧数据sql语句
	 */
	public static String delete_user;
	public static String delete_dept;

	/**
	 * 更新部门表，parentId 是总公司1000的情况
	 */
	public static String update_dept_parentid_eq_1000;

	/**
	 * 更新部门表，parentId 是自己id的情况
	 */
	public static String update_dept_parentid_eq_id;
 
	/**
	 * 通过属性转对象
	 * 
	 * @param properties
	 */
	public static void toVo(Properties properties) {
		delete_dept = properties.getProperty("delete_dept");
		delete_user = properties.getProperty("delete_user");
		update_dept_parentid_eq_1000 = properties.getProperty("update_dept_parentid_eq_1000");
		update_dept_parentid_eq_id = properties.getProperty("update_dept_parentid_eq_id");

		query_user = properties.getProperty("query_user");
		query_dept = properties.getProperty("query_dept");
		query_branch = properties.getProperty("query_branch");

		sqlServerPassword = properties.getProperty("sqlServerPassword");
		sqlServerUser = properties.getProperty("sqlServerUser");
		jtdsDriver = properties.getProperty("jtdsDriver");
		jtdsUrl = properties.getProperty("jtdsUrl");

		oracleDriver = properties.getProperty("oracleDriver");
		oraclePssword = properties.getProperty("oraclePssword");
		oracleUrl = properties.getProperty("oracleUrl");
		oracleUser = properties.getProperty("oracleUser");
	}
}
