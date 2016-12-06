package org.wanwanframework.flower.jdbc.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.wanwanframework.flower.jdbc.model.DeptVo;
import org.wanwanframework.flower.jdbc.model.SqlEntity;
import org.wanwanframework.flower.jdbc.util.ListUtil;

public class BranchMapper  implements RowMapper<SqlEntity>{

	@Override
	public SqlEntity mapRow(ResultSet result, int rowNum) throws SQLException {
		DeptVo vo = new DeptVo();
		String code = result.getString("branchcostcode");
		String parentCode = result.getString("supBranchCostCode");
		boolean isNumber = ListUtil.isNumber(code);
		if (isNumber == false) {
			return null;// 濡傛灉涓嶆槸鏁板瓧灏辩洿鎺ュ彇涓嬩竴涓褰�
		}
		vo.setId(Integer.parseInt(code));
		if (code != null && code.length() > 0) {
			vo.setCode(code);
			vo.setChinaName(result.getString("branchDesc"));
			vo.setName("vvvv");
			vo.setParent(Long.parseLong(parentCode));
			vo.setCompany(vo.getId());
			//鍚屾涔嬪墠鏋舵瀯鐨勯儴闂↖d
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
