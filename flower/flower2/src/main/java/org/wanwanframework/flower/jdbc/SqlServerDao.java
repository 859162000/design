package org.wanwanframework.flower.jdbc;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.wanwanframework.flower.jdbc.model.SqlEntity;

/**
 * 操作远程sqlserver数据库的类
 * 
 * @author
 *
 */
@Service
public class SqlServerDao {

	@Resource(name = "sqlServerJdbcTemplate")
	protected JdbcTemplate jdbc;

	/**
	 * 查询表中的所有数据，通用方法
	 * 
	 * @param sql
	 * @return
	 */
	public List<Map<String, Object>> query(String sql) {
		List<Map<String, Object>> list = jdbc.queryForList(sql);
		return list;
	}

	/**
	 * 查询部门、用户、分支机构的实体，用mapper的子类进行区分
	 * 
	 * @param sql
	 * @param field
	 * @return
	 */
	public List<SqlEntity> query(String sql, RowMapper<SqlEntity> mapper) {
		List<SqlEntity> list = jdbc.query(sql, mapper);
		return list;
	}

}
