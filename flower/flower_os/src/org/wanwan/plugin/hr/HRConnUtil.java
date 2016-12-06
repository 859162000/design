package org.wanwan.plugin.hr;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.wanwan.plugin.hr.model.DeptVo;

public class HRConnUtil {

	/**
	 * 由于表中存在依赖关系，所以两张表一起删
	 * 先删除user表，再删除dept表
	 * 
	 * @param sql
	 * @param hrConn
	 * @return
	 */
	public static boolean deleteTable(HRConn hrConn) {
		return executeDelete(hrConn);// 删除oracle的老数据;
	}

	public static boolean updateDept(HRConn hrConn) {
		return executeUpdateDept(hrConn);// 删除oracle的老数据;
	}

	public static boolean executeQuery(HRConn hrConn){
		return false;
	}
	
	/**
	 * 通过sql删除 oralce中的表数据 (该方法暂不关闭链接 ， 在最后统一关闭jdbc)
	 * 
	 * @throws SQLException
	 * 
	 */
	private static boolean executeDelete(HRConn hrConn) {
		hrConn = new HRConn();
		boolean ret = false;
		PreparedStatement ps = null;
		try {
			hrConn.connectionOracle.setAutoCommit(false);
			ps = hrConn.connectionOracle.prepareStatement(ConnectionConfig.delete_user);
			ps.execute();
			ps.close();
			ps = hrConn.connectionOracle.prepareStatement(ConnectionConfig.delete_dept);
			ps.execute();
			ps.close();
			hrConn.connectionOracle.commit();
			ret = true;
		} catch (Exception e) {
			e.printStackTrace();
			try {
				hrConn.connectionOracle.rollback();
			} catch (SQLException e1) { 
				e1.printStackTrace();
			}
			throw new RuntimeException("删除失败!");
		} finally {
			if (ps != null) {
				hrConn.closeStatement(ps);
			}
		}
		return ret;
	}

	/**
	 * 通过sql删除 oralce中的表数据 (该方法暂不关闭链接 ， 在最后统一关闭jdbc)
	 * 
	 * @throws SQLException
	 * 
	 */
	private static boolean executeUpdateDept(HRConn hrConn) {
		hrConn = new HRConn();
		boolean ret = false;
		PreparedStatement ps = null;
		try {
			hrConn.connectionOracle.setAutoCommit(false);
			ps = hrConn.connectionOracle.prepareStatement(ConnectionConfig.update_dept_parentid_eq_1000);
			ps.execute();
			ps.close();
			ps = hrConn.connectionOracle.prepareStatement(ConnectionConfig.update_dept_parentid_eq_id);
			ps.execute();
			ps.close();
			hrConn.connectionOracle.commit();
			ret = true;
		} catch (Exception e) {
			e.printStackTrace();
			try {
				hrConn.connectionOracle.rollback();
			} catch (SQLException e1) { 
				e1.printStackTrace();
			}
			throw new RuntimeException("更新部门表失败!");
		} finally {
			if (ps != null) {
				hrConn.closeStatement(ps);
			}
		}
		return ret;
	}
 
	/**
	 * 将塞进parent属性里的dept_code转化为dept_id
	 * 
	 * @param deptList
	 */
	@SuppressWarnings("unused")
	public static void toDepartmentId(List<DeptVo> deptList) {
		for (DeptVo vo : deptList) {
			//vo.setParent(ListUtil.findDepartId("" + vo.getParent(), deptList));
		}
	}
 
	/**
	 * 排序过滤
	 */
	public static void sortList(List<DeptVo> list) {
		DeptVo vo = null;
		for (int i = 0; i < list.size(); i++) {
			vo = list.get(i);
			if (vo.getParent() > vo.getId()) {
				int j = getDeptByParent(list, vo.getParent());
				if (i < j) {// 如果对象排序到后面去了就可以不用交换了，对象如果排位靠前则需要交换
					DeptVo parentVo = list.get(j);
					list.set(i, parentVo);
					list.set(j, vo);
				}
			}
		}
	}

	public static int getDeptByParent(List<DeptVo> list, long parentId) {
		DeptVo vo = null;
		for (int i = 0; i < list.size(); i++) {
			vo = list.get(i);
			if (vo.getId() == parentId) {
				return i;
			}
		}
		return -1;
	}

}
