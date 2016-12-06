package org.wanwanframework.flower.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.wanwanframework.flower.jdbc.model.SqlEntity;
import org.wanwanframework.flower.jdbc.util.ListUtil;

/**
 * 操作本地的数据库ems的dao,用于同步本地的t_user,t_dept表.
 * 
 * @author
 *
 */
@Service
public class SpringDao {

	@Resource(name = "jdbcTemplate")
	protected JdbcTemplate jdbc;

	/**
	 * 查询所有的数据
	 * 
	 * @param sql
	 * @return
	 */
	public List<Map<String, Object>> query(String sql) {
		List<Map<String, Object>> list = jdbc.queryForList(sql);
		return list;
	}

	/**
	 * 查询表中某一个字段集合：主要用于搜索数据库中是否已经有了相同ID的数据,如果有了就用update的方式更新，没有就用insert方式
	 * 
	 * @param sql
	 * @param field
	 * @return
	 */
	public List<String> query(String sql, String field) {
		final String fieldz = field;
		List<String> list = jdbc.query(sql, new RowMapper<String>() {

			@Override
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString(fieldz);
			}

		});
		return list;
	}
	
	/**
	 * 查询表中id和code:以code为key,id为value返回对象
	 * 
	 * @param sql
	 * @param field
	 * @return
	 */
	public List<Object[]> query(String sql, String codeField, String idField) {
		final String codez = codeField;
		final String idz = idField;
		List<Object[]> list = jdbc.query(sql, new RowMapper<Object[]>() {

			@Override
			public Object[] mapRow(ResultSet rs, int rowNum) throws SQLException { 
				String key = rs.getString(codez);
				int value = Integer.parseInt(rs.getString(idz));
				Object[] objects = {key, value}; 
				return objects;
			}

		});
		return list;
	}

	/**
	 * 获取数据库中的某个字段
	 * 
	 * @param sql select *from user where id = ?
	 * @param id
	 * @return
	 */
	public Class<?> get(String sql, String code, Class<?> classs) {
		return jdbc.queryForObject(sql, new Object[] { code }, BeanPropertyRowMapper.newInstance(classs.getClass()));
	}

	/**
	 * 查询单个字段：主要用于搜索数据库中是否已经有了相同ID的数据,如果有了就用update的方式更新，没有就用insert方式
	 * 
	 * @param sql select *from user where id = ?
	 * @param id
	 * @return
	 */
	public String get(String sql, String code) {
		String tableId = jdbc.queryForObject(sql, new Object[] { code }, String.class);
		return tableId;
	}

	/**
	 * 批量更新数据库
	 * 
	 * @param list
	 */
	public void updateList(List<SqlEntity> list) {
		String[] sqls = new String[list.size()];
		int i = 0;
		String sql = null; 
		for (SqlEntity entity : list) {
			if (entity != null) {
				sql = entity.toSql();
				sqls[i++] = sql;
				System.out.println("sql:" + sql); 
			} 
		}
		String[] realSqls = ListUtil.cutArry(sqls, i);
		int[] rs = jdbc.batchUpdate(realSqls); 
		System.out.println("rs:" + rs);
		
	}

	/**
	 * 单个更新
	 * 
	 * @param sql
	 */
	public void update(String sql) {
		jdbc.update(sql);
	}

	/**
	 * 用于在数据库插入完毕后，统一调用修改company与parent不融洽的后续方法。
	 * 
	 * @param sql
	 */
	public void execute(String sql) {
		jdbc.execute(sql);
	}
}
