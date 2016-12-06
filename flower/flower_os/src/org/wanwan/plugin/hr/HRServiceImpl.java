package org.wanwan.plugin.hr;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.wanwan.flower.jdbc.util.ListUtil;
import org.wanwan.plugin.hr.model.DeptVo;
import org.wanwan.plugin.hr.model.SqlVo;
import org.wanwan.plugin.hr.model.UserVo;

/**
 * 先删除后执行查询插入
 * 
 * @author Administrator
 *
 */
@Service(value = "hRInterfaceService")
public class HRServiceImpl {
	private List<DeptVo> deptList;// 存储和user表关联的id信息
	private HRConn hrConn = null;
	private Statement statement = null;
	private boolean ret = false;

	/**
	 * 开始执行
	 */
	public void start() {
		//this.deleteData();// 先插入分支机构表，确定parent属性
		this.insertBranch();
		this.insertDepartment();
		this.insertUser();
		this.updateData();
	}
	
	public void openConnection(){
		
	}
	
	public void closeConnection(){
		
	}

	public HRServiceImpl() {
		hrConn =   new HRConn();
	}

	/**
	 * 创建数据集
	 * 
	 * @throws SQLException
	 */
	private void prepareConnection() throws SQLException {
		hrConn.connectionOracle.setAutoCommit(false);
		this.statement = hrConn.connectionOracle.createStatement();
	}

	public void deleteData() {
		hrConn =  new HRConn();
		ret = HRConnUtil.deleteTable(hrConn);// 删除表：user和dept一起删
	}

	public void updateData() {
		hrConn =  new HRConn();
		ret = HRConnUtil.updateDept(hrConn);
	}

	/**
	 * 同步department
	 * 
	 */
	public void insertDepartment() {
		hrConn =  new HRConn();
		try {
			deptList = this.findDepartment(ConnectionConfig.query_dept);// 先从 sqlServer数据库中查询出来
			if (ret) {
				prepareConnection();
				HRConnUtil.toDepartmentId(deptList);// 插入之前，先转换一下parentId和code的关系;
				HRConnUtil.sortList(deptList);
				DeptVo vo = null;
				for (int i = 0; i < deptList.size(); i++) {
					vo = deptList.get(i);
					executeInsert(vo, statement);
				}
				hrConn.connectionOracle.commit();
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage() + ".............................插入dept表失败");
			throw new RuntimeException("插入dept失败!");
		} finally {
			hrConn.closeInsert(statement);
		}
	}

	/**
	 * 同步人员
	 * 返回 ：1 表示失败 ； 0表示成功 ； 2是 初始值
	 */
	public int insertUser() {
		hrConn =  new HRConn();
		int state = 2;
		try {
			List<UserVo> tuserList = findUser(ConnectionConfig.query_user);// sqlserver,先从 sqlServer数据库中查询出来
			if (ret) {
				prepareConnection();
				for (UserVo vo : tuserList) {
					executeInsert(vo, statement);
				}
				hrConn.connectionOracle.commit();
				state = 0;
			}
		} catch (Exception e) {
			System.out.println("...............插入user失败!");
			e.printStackTrace();
			throw new RuntimeException("插入user失败!");
		} finally {
			hrConn.closeInsert(statement);
		}
		return state;
	}

	/**
	 * 同步t_branch
	 * 返回 ：1 表示失败 ； 0表示成功 ； 2是 初始值
	 */
	@SuppressWarnings("unchecked")
	public int insertBranch() {
		hrConn =  new HRConn();
		int state = 2;
		try {
			List<DeptVo> list = this.findBranch(ConnectionConfig.query_branch); // 先从 sqlServer数据库中查询出来
			if (ret) {
				prepareConnection();
				// insertRoot(statement);
				Collections.sort(list);
				for (DeptVo vo : list) {
					executeInsert(vo, statement);
				}
				hrConn.connectionOracle.commit();
				state = 0;
			}
		} catch (Exception e) {
			System.out.println("...............插入branch失败!");
			e.printStackTrace();
			state = 1;
			throw new RuntimeException("插入branch失败!");
		} finally {
			hrConn.closeInsert(statement);
		}
		return state;
	}

	/**
	 * 每个表插入的基础方法
	 * 
	 * @param sql
	 * @param statement
	 */
	private void executeInsert(SqlVo vo, Statement statement) {
		String sql = null;
		try {
			sql = vo.toUpdate();
			statement.executeUpdate(sql);
			System.out.println("同步sql --> " + sql);
		} catch (SQLException e) {
			System.out.println("异常sql --> " + sql);
			e.printStackTrace();
		}
	}

	private void findDeptVo(ResultSet result, List<DeptVo> list) throws NumberFormatException, SQLException {
		DeptVo vo = null;
		int deptId = 100000;// 从四位数以上开始和公司分支机构错开
		while (result.next()) {
			// 当结果集不为空时
			deptId++;
			vo = new DeptVo();
			vo.setId(deptId);
			String code = result.getString("departmentcostcode");
			if (code != null && code.length() > 0 && ListUtil.isNumber(code)) {
				if (code.length() > 10) {
					code = code.substring(0, 9);
				}
				vo.setCode(code);
				vo.setName(result.getString("DeptCode"));
				vo.setChinaName(result.getString("DeptDesc"));
				String companyId = result.getString("supBranchCostCode");
				String parentId = result.getString("supDepartMentCostCode");
				boolean isNumber = ListUtil.isNumber(companyId);
				if (isNumber == false) {
					continue;
				}
				vo.setParent(Long.parseLong(parentId));
				vo.setCompany(Integer.parseInt(companyId));
				//同步之前架构的部门Id
				String syncId = result.getString("DeptId");
				if (isNumber == false) {
					continue;
				}
				vo.setSync_id(Integer.parseInt(syncId));

				list.add(vo);
			}
		}
	}

	/**
	 * 查询Department
	 */
	public List<DeptVo> findDepartment(String sql) {
		PreparedStatement pre = null;
		ResultSet result = null;// 创建一个结果集对象
		if (hrConn == null) {
			hrConn =  new HRConn();
		}
		int state = 0;
		List<DeptVo> tDepartmentList = new ArrayList<DeptVo>();
		try {
			pre = hrConn.connectionSql.prepareStatement(sql);// 实例化预编译语句
			result = pre.executeQuery();// 执行查询，注意括号中不需要再加参数
			findDeptVo(result, tDepartmentList);
		} catch (Exception e) {
			e.printStackTrace();
			state = 1;
		} finally {
			this.hrConn.closeQuery(pre, result);
		}
		if (state == 1) {
			throw new RuntimeException("查询TBranch失败!");
		}
		return tDepartmentList;
	}

	private void findUserVo(ResultSet result, List<UserVo> list) throws SQLException {
		UserVo user = null;
		while (result.next()) {
			// 当结果集不为空时select u.userid, u.username, u.name, u.departmentcostcode from t_user u;
			user = new UserVo();
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
				int deptId = 1000;//ListUtil.findDepartId(depart, this.deptList);
				user.setDepartmentcostcode("" + deptId);
				// String company = result.getString("departmentcostcode").substring(0, 3);
				user.setCompanyid("" + deptId);// Integer.parseInt(company);
				// ...
				// tuser.setEmail(result.getString("email"));
				list.add(user);
			}
		}
		user = new UserVo(0, "admin", "系统管理员", "1000", "1000");
		list.add(user);
	}

	/**
	 * 从sqlServer 查询出所有人员 (该方法暂不关闭链接 ， 在最后统一关闭jdbc)
	 */
	public List<UserVo> findUser(String sql) {
		PreparedStatement pre = null;
		ResultSet result = null;// 创建一个结果集对象
		if (hrConn == null) {
			hrConn =  new HRConn();
		}
		List<UserVo> userList = new ArrayList<UserVo>();
		try {
			pre = hrConn.connectionSql.prepareStatement(sql);// 实例化预编译语句
			result = pre.executeQuery();// 执行查询，注意括号中不需要再加参数
			findUserVo(result, userList);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("查询TUser失败!");
		} finally {
			this.hrConn.closeQuery(pre, result);
		}
		return userList;
	}

	private void findBranchVo(ResultSet result, List<DeptVo> list) throws NumberFormatException, SQLException {
		DeptVo vo = null;
		while (result.next()) {
			// 当结果集不为空时
			vo = new DeptVo();
			String code = result.getString("branchcostcode");
			String parentCode = result.getString("supBranchCostCode");
			boolean isNumber = ListUtil.isNumber(code);
			if (isNumber == false) {
				continue;// 如果不是数字就直接取下一个记录
			}
			vo.setId(Integer.parseInt(code));
			if (code != null && code.length() > 0) {
				vo.setCode(code);
				vo.setChinaName(result.getString("branchDesc"));
				vo.setName(result.getString("branchDesc_en"));
				vo.setParent(Long.parseLong(parentCode));
				vo.setCompany(vo.getId());
				//同步之前架构的部门Id
				String syncId = result.getString("BranchId");
				if (isNumber == false) {
					continue;
				}
				vo.setSync_id(Integer.parseInt(syncId));
				list.add(vo);
			}
		}
	}

	/**
	 * 
	 * 查询branch
	 */
	public List<DeptVo> findBranch(String sql) {
		PreparedStatement pre = null;
		ResultSet result = null;// 创建一个结果集对象

		if (hrConn == null) {
			hrConn =  new HRConn();
		}
		List<DeptVo> list = new ArrayList<DeptVo>();
		try {
			pre = hrConn.connectionSql.prepareStatement(sql);// 实例化预编译语句
			result = pre.executeQuery();// 执行查询，注意括号中不需要再加参数
			findBranchVo(result, list);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("查询TBranch失败!");
		} finally {
			this.hrConn.closeQuery(pre, result);
		}
		return list;
	}

}
