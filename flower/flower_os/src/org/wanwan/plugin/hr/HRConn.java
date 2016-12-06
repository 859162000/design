package org.wanwan.plugin.hr;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * 获取sqlServer 和 oracle的数据源
 * Yao5816
 */
public class HRConn {

	/**
	 * 数据源1 sqlserver
	 */
	// private static String sqlServerDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	// private static String sqlServerUrl = "jdbc:sqlserver://10.132.21.18:1433;DatabaseName=Issue_Test";
	// public final static String sqlServerUser = "issuetestread";
	// public final static String sqlServerPassword = "issuetestread";

	/**
	 * 数据源1.2 jtds
	 */
	// public final static String jtdsDriver = "net.sourceforge.jtds.jdbc.Driver";
	// public final static String jtdsUrl = "jdbc:jtds:sqlserver://10.132.21.18:1433;DatabaseName=Issue_Test";

	/**
	 * 数据源2 oracle
	 */
	// private final static String oracleDriver = "oracle.jdbc.driver.OracleDriver";
	// private final static String oracleUrl = "jdbc:oracle:thin:@58.17.241.93:1521/CISTEST"; //
	// 127.0.0.1是本机地址，XE是精简版Oracle的默认数据库名
	// private final static String oracleUser = "ems";// 用户名,系统默认的账户名
	// private final static String oraclePssword = "D33gw1TYs";// 你安装时选设置的密码

	/**
	 * sqlserver查询表数据sql语句
	 */
	// public final static String query_user = "select * from t_user u ";
	// public final static String query_dept = "select * from t_Department order by departmentcostcode";
	// public final static String query_branch = "select * from t_branch ";

	/**
	 * oracle删除旧数据sql语句
	 */
	// public final static String delete_user = "delete from t_user";
	// public final static String delete_dept = "delete from t_dept";

	/**
	 * 更新部门表，parentId 是总公司1000的情况
	 */
	// public final static String update_dept_parentid_eq_1000 = "update t_dept d set d.parent_id = '' where d.parent_id
	// = '1000'";

	/**
	 * 更新部门表，parentId 是自己id的情况
	 */
	// public final static String update_dept_parentid_eq_id = "update t_dept d set d.parent_id = d.company_id where
	// d.id = d.parent_id";

	// jdbc.url = jdbc:oracle:thin:@10.132.21.18:1521/oatest
	// jdbc.username = ems
	// jdbc.password = D33gw1TYs

	/**
	 * 获取sqlServer数据库连接
	 */
	public Connection connectionSql = null;

	/**
	 * 获取oracle链接
	 */
	public Connection connectionOracle = null;
 
	/**
	 * 获取sqlServer 和 oracle的数据源
	 */
	public HRConn() {
		SynchronizeUtils.read();
		connectionSql = conSqlServer();
		connectionOracle = conOracle();
	}

	/**
	 * 获取sqlServer数据源
	 */
	private Connection conSqlServer() {
		try {
			Class.forName(ConnectionConfig.jtdsDriver);
			connectionSql = DriverManager.getConnection(ConnectionConfig.jtdsUrl, ConnectionConfig.sqlServerUser,
					ConnectionConfig.sqlServerPassword);
			System.out.println("sqlserver连接数据库成功");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("sqlserver数据库链接失败!");
		}
		return connectionSql;
	}

	/**
	 * 连接Oracle数据源
	 */
	private Connection conOracle() {
		try {
			Class.forName(ConnectionConfig.oracleDriver);// 加载Oracle驱动程序
			connectionOracle = DriverManager.getConnection(ConnectionConfig.oracleUrl, ConnectionConfig.oracleUser,
					ConnectionConfig.oraclePssword);// 获取连接
			System.out.println("oracle连接成功！");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("oracle数据库链接失败vvvv!");
		}
		return connectionOracle;
	}

	/**
	 * 关闭 preparedstatement
	 * 
	 * @param pst
	 */
	private void closePreparedStatement(PreparedStatement pst) {
		if (pst != null) {
			try {
				pst.close();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}

	}

	/**
	 * 关闭resultSet
	 * 
	 * @param rs
	 */
	private void closeResultSet(ResultSet rs) {
		if (rs != null) {
			try {
				rs.close();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 关闭statement
	 * 
	 * @param rs
	 */
	public void closeStatement(Statement statement) {
		if (statement != null) {
			try {
				statement.close();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 关闭sqlserver链接
	 * 
	 */
	private void closeConnectionSql() {
		if (connectionSql != null) {
			try {
				connectionSql.close();
				System.out.println("关闭sqlServer链接vvvv!");
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 关闭oracle链接
	 */
	private void closeConnectionOracle() {
		if (connectionOracle != null) {
			try {
				connectionOracle.close();
				System.out.println("关闭oracle链接!vvvv");
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 关闭查询器
	 * PreparedStatement pre = null;
	 * ResultSet result = null;// 创建一个结果集对象
	 */
	public void closeQuery(PreparedStatement pre, ResultSet result) {
		if (result != null) {
			this.closeResultSet(result);
		}
		if (pre != null) {
			this.closePreparedStatement(pre);
		}
	}

	/**
	 * 关闭插入器
	 * 关闭 oracle 和 sqlserver 的 connection
	 */
	public void closeInsert(Statement statement) {
		if (this.connectionSql != null) {
			this.closeConnectionSql();
		}
		if (this.connectionOracle != null) {
			this.closeConnectionOracle();
		}
		if (statement != null) {
			this.closeStatement(statement);
		}
	}
}
