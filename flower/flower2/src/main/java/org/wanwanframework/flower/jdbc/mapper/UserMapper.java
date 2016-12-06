package org.wanwanframework.flower.jdbc.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.wanwanframework.flower.jdbc.model.SqlEntity;
import org.wanwanframework.flower.jdbc.model.UserVo;

public class UserMapper  implements RowMapper<SqlEntity>{

	@Override
	public SqlEntity mapRow(ResultSet result, int rowNum) throws SQLException {
		UserVo user = new UserVo();
		user.setId(result.getInt("userid"));
		user.setCode(result.getString("username"));
		user.setChinaName(result.getString("name"));

		user.setEmail(result.getString("Email1"));
		user.setSync_id(result.getInt("UserId"));
		user.setMobile(result.getString("Mobile"));
		String telePhone = result.getString("PhoneNo");
		if (telePhone != null && telePhone.length() > 0) {
			user.setTelephone(telePhone);
		}
		user.setRemark("");

		String depart = result.getString("departmentcostcode");
		if (depart != null && depart.length() > 0) {
			// int deptId = ListUtil.findDepartId(depart, this.deptList);--暂时不设置部门id
			user.setDepartmentcostcode("" + 1000);
			// String company = result.getString("departmentcostcode").substring(0, 3);
			user.setCompanyid("" + 1000);// Integer.parseInt(company);
			// ...
			// tuser.setEmail(result.getString("email"));
			return (SqlEntity) user;
		}
		return null;
	}
}
