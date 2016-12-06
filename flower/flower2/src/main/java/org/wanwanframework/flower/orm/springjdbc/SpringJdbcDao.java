package org.wanwanframework.flower.orm.springjdbc;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.wanwanframework.flower.jdbc.util.ListUtil;

public class SpringJdbcDao {

	@Resource(name = "jdbcTemplate")
	protected JdbcTemplate jdbcTemplate;

	/**
	 * 批量更新数据库
	 * 
	 * @param list
	 */
	public int[] batchUpdate(List<String> SqlList) {
		String[] sqls = new String[SqlList.size()];
		int i = 0; 
		for (String entity : SqlList) {
			if (entity != null) { 
				sqls[i++] = entity; 
			}
		}
		String[] realSqls = ListUtil.cutArry(sqls, i);
		int[] rs = jdbcTemplate.batchUpdate(realSqls);
		return rs;
	}
    
	public int[] batchUpdateByPreparedStatement(String sql, final List<Object[]> actors) {

		int[] updateCounts = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				ps.setString(1, actors.get(i)[0].toString());
			}

			@Override
			public int getBatchSize() {
				return actors.size();
			}

		});
		return updateCounts;
	}
}
