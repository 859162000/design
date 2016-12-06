package org.wanwanframework.flower.jdbc.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.wanwanframework.flower.jdbc.model.DeptVo;
import org.wanwanframework.flower.jdbc.model.SqlEntity;
import org.wanwanframework.flower.jdbc.util.ListUtil;

public class DeptMapper implements RowMapper<SqlEntity>{
	
	int deptId = 100000;
	
	@Override
	public SqlEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
		DeptVo vo = new DeptVo();
		deptId++;
		vo = new DeptVo();
		vo.setId(deptId);
		String code = rs.getString("departmentcostcode");
		if (code != null && code.length() > 0 && ListUtil.isNumber(code)) {
			if (code.length() > 10) {
				code = code.substring(0, 9);
			}
			vo.setCode(code);
			vo.setName(rs.getString("DeptCode"));
			vo.setChinaName(rs.getString("DeptDesc"));
			String companyId = rs.getString("supBranchCostCode");
			String parentId = rs.getString("supDepartMentCostCode");
			boolean isNumber = ListUtil.isNumber(companyId);
			if (isNumber == false) {
				return null;
			}
			vo.setParent(Long.parseLong(parentId));
			vo.setCompany(Integer.parseInt(companyId));
			// 同步之前架构的部门Id
			String syncId = rs.getString("DeptId");
			if (isNumber == false) {
				return null;
			}
			vo.setSync_id(Integer.parseInt(syncId));
		}
		return vo;
	}
}
