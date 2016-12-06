package org.wanwan.flower.jdbc.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.wanwan.flower.jdbc.model.DeptVo;
import org.wanwan.flower.jdbc.model.SqlEntity;
import org.wanwan.flower.jdbc.util.ListUtil;

public class BranchMapper  implements RowMapper<SqlEntity>{

	@Override
	public SqlEntity mapRow(ResultSet result, int rowNum) throws SQLException {
		DeptVo vo = new DeptVo();
		String code = result.getString("branchcostcode");
		String parentCode = result.getString("supBranchCostCode");
		boolean isNumber = ListUtil.isNumber(code);
		if (isNumber == false) {
			return null;// 如果不是数字就直接取下一个记录
		}
		vo.setId(Integer.parseInt(code));
		if (code != null && code.length() > 0) {
			vo.setCode(code);
			vo.setChinaName(result.getString("branchDesc"));
			vo.setName("vvvv");
			vo.setParent(Long.parseLong(parentCode));
			vo.setCompany(vo.getId());
			//同步之前架构的部门Id
			String syncId = result.getString("BranchId");
			if (isNumber == false) {
				return null;
			}
			vo.setSync_id(Integer.parseInt(syncId));
			return vo;
		}
		return null;
	}

}
