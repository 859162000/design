package org.wanwanframework.flower.jdbc.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.wanwanframework.flower.jdbc.SpringDao;
import org.wanwanframework.flower.jdbc.SqlServerDao;
import org.wanwanframework.flower.jdbc.mapper.BranchMapper;
import org.wanwanframework.flower.jdbc.mapper.DeptMapper;
import org.wanwanframework.flower.jdbc.mapper.UserMapper;
import org.wanwanframework.flower.jdbc.model.SqlEntity;
import org.wanwanframework.flower.jdbc.util.ListUtil;

/**
 * AD鍚屾service锛氭湰鍦版秹鍙婄敤鎴疯〃鍜岄儴闂ㄨ〃锛屾暟鎹潵婧恠qlserver鐨勭敤鎴疯〃銆侀儴闂ㄨ〃銆佸拰鍒嗘敮鏈烘瀯琛�
 * 
 * @author
 *
 */
@Service
public class SystemSynchronizeService {

	@Resource
	SpringDao localDao;

	@Resource
	SqlServerDao serverDao;

	/**
	 * 鍙娇鐢ㄤ竴涓柟娉曞疄鐜板list瀵硅薄鐨勭敓鎴愶細dept琛ㄧ殑parent瀛楁闇�瀵瑰厛鍚庨『搴忕害鏉�
	 * 
	 * @param localSql select * from t_dept
	 * @param severSql select * from t_Department order by departmentcostcode
	 * @param mapper DeptMapper()
	 * @return
	 */
	private List<SqlEntity> getList(String localSql, String severSql, RowMapper<SqlEntity> mapper) {

		List<String> codes = localDao.query(localSql, "code");
		List<SqlEntity> list = serverDao.query(severSql, mapper);
		for (String code : codes) {
			SqlEntity entity = ListUtil.findEntity(code, list);
			if (entity != null) {
				entity.setType(SqlEntity.update);// 鎵惧埌浜嗗氨鏄痷pdate
			}
		}
		System.out.println("list:" + list);
		return list;
	}

	/**
	 * 鍚屾鏈湴閮ㄩ棬琛�
	 */
	public void updateDept() {
		String localSql = "select * from t_dept";
		String severSql = "select * from t_Department order by departmentcostcode";

		RowMapper<SqlEntity> mapper = new DeptMapper();
		List<SqlEntity> list = getList(localSql, severSql, mapper);
		ListUtil.toDepartmentId(list);
		ListUtil.sortList(list);
		localDao.updateList(list);
	}

	/**
	 * 鍚屾鏈湴鍒嗘敮鏈烘瀯
	 */
	public void updateBranch() {
		String localSql = "select * from t_dept";
		String severSql = "select * from t_branch";

		RowMapper<SqlEntity> mapper = new BranchMapper();
		List<SqlEntity> list = getList(localSql, severSql, mapper);
		localDao.updateList(list);
	}

	/**
	 * 鍚屾鏈湴浜哄憳
	 */
	public void updateUser() {
		String localSql = "select * from t_user";
		String severSql = "select * from t_user";

		RowMapper<SqlEntity> mapper = new UserMapper();
		List<SqlEntity> list = getList(localSql, severSql, mapper);
		localDao.updateList(list);
	}
}
