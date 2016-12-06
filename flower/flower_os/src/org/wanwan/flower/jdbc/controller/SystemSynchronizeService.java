package org.wanwan.flower.jdbc.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.wanwan.flower.jdbc.SpringDao;
import org.wanwan.flower.jdbc.SqlServerDao;
import org.wanwan.flower.jdbc.mapper.BranchMapper;
import org.wanwan.flower.jdbc.mapper.DeptMapper;
import org.wanwan.flower.jdbc.mapper.UserMapper;
import org.wanwan.flower.jdbc.model.SqlEntity;
import org.wanwan.flower.jdbc.util.ListUtil;

/**
 * AD同步service：本地涉及用户表和部门表，数据来源sqlserver的用户表、部门表、和分支机构表
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
	 * 只使用一个方法实现对list对象的生成：dept表的parent字段需要对先后顺序约束
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
				entity.setType(SqlEntity.update);// 找到了就是update
			}
		}
		System.out.println("list:" + list);
		return list;
	}

	/**
	 * 同步本地部门表
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
	 * 同步本地分支机构
	 */
	public void updateBranch() {
		String localSql = "select * from t_dept";
		String severSql = "select * from t_branch";

		RowMapper<SqlEntity> mapper = new BranchMapper();
		List<SqlEntity> list = getList(localSql, severSql, mapper);
		localDao.updateList(list);
	}

	/**
	 * 同步本地人员
	 */
	public void updateUser() {
		String localSql = "select * from t_user";
		String severSql = "select * from t_user";

		RowMapper<SqlEntity> mapper = new UserMapper();
		List<SqlEntity> list = getList(localSql, severSql, mapper);
		localDao.updateList(list);
	}
}
