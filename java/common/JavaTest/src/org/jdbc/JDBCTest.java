package org.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

// 查询数据库中的内容
public class JDBCTest {

	public static final String DBDRIVER = "oracle.jdbc.driver.OralceDriver";

	public static final String DBURL = "jdbc:oracle:thin:@locast:1521:orcl";

	public static final String DBUSER = "admin";

	public static final String DBPASS = "admin";

	public static void main(String[] args) throws Exception {

		Connection conn = null;// 表示数据库连接的对象

		Statement stmt = null;// 表示数据库更新操作

		ResultSet result = null;// 表示接受数据库查询到的结果

		Class.forName(DBDRIVER);// 使用class类加载驱动程序

		conn = DriverManager.getConnection(DBURL, DBUSER, DBPASS);// 连接数据库

		stmt = conn.createStatement();// tatement接口需要通过connection接口进行实例化操作

		result = stmt.executeQuery("select * from person");// 执行sql语句，结果集放在result中

		while (result.next()) {// 判断是否还有下一行
			String name = result.getString("name");// 获取数据库person表中name字段的值
			System.out.println(name);
		}
		result.close();
		stmt.close();
		conn.close();

	}

}