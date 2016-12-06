package org.wanwan.plugin.springjdbc.support;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;

/**
 * 简单批处理类：其他的复杂批量更新用匿名内部类实现
 * 
 * @author
 *
 */
public class SimpleBatchPreparedStatementSetter implements BatchPreparedStatementSetter {

	protected List<Object[]> list;
	
	protected StatementSetter setter;

	@Override
	public int getBatchSize() {
		return list.size();
	}

	@Override
	public void setValues(PreparedStatement ps, int i) throws SQLException {
		Object[] objects = list.get(i);
		setter.setter(ps, objects); 
	}

	public List<Object[]> getList() {
		return list;
	}

	public void setList(List<Object[]> list) {
		this.list = list;
	}

	public StatementSetter getSetter() {
		return setter;
	}

	public void setSetter(StatementSetter setter) {
		this.setter = setter;
	}
	
}
