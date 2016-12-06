package org.wanwan.plugin.springjdbc.support;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public abstract class StatementSetter {
    
	public void setter(PreparedStatement ps, Object[] objects) throws SQLException{
		ps.setInt(1, (int) objects[0]); // id
		ps.setString(2, objects[1].toString().trim());// code
		ps.setString(3, objects[2].toString().trim()); // name
	}
}
