package org.wanwan.plugin.springjdbc.util;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.common.util.StringHelper;
import org.wanwan.flower.jdbc.model.SqlEntity;
import org.wanwan.flower.jdbc.model.UserVo;
import org.wanwan.plugin.hr.model.DeptVo;

/**
 * 同步AD时所有与List有关的操作统一放置的工具类
 * 
 * @author
 *
 */
public class ListUtil {

	/**
	 * 判断一个字符串是否是数字
	 * 
	 * @param id
	 * @return
	 */
	public static boolean isNumber(String id) {
		boolean isNum = id.matches("\\d+");
		return isNum;
	}

	public static int findDepartIdByObject(String code, List<Object[]> deptList) {
		for (Object[] vo : deptList) {
			if (vo != null && vo[0]!= null && vo[0].toString().equals(code)) {
				return (int)vo[1];
			}
		}
		return 1000;
	}
	
	/**
	 * 将user对象中的code值转化成id
	 * 
	 * @param deptList
	 */
	public static void toUserDept(List<Object[]> deptParam, List<SqlEntity> userList) {
		int company;
		int dept;
		for (SqlEntity vo : userList) {
			company = ListUtil.findDepartIdByObject(((UserVo) vo).getCompanyid(), deptParam);
			((UserVo) vo).setCompanyid("" + company);
			dept = ListUtil.findDepartIdByObject(((UserVo) vo).getDepartmentcostcode(), deptParam);
			((UserVo) vo).setDepartmentcostcode("" + dept);
		}
	}

	/**
	 * 根据部门code去找dept的id
	 * 
	 * @param code
	 * @return
	 */
	public static int findDepartId(String code, List<SqlEntity> deptList) {
		for (SqlEntity vo : deptList) {
			if (vo != null && vo.getCode() != null && vo.getCode().equals(code)) {
				return vo.getId();
			}
		}
		return 1000;
	}
	
	/**
	 * 将塞进parent属性里的dept_code转化为dept_id
	 * 
	 * @param deptList
	 */
	public static void toDepartmentId(List<SqlEntity> deptList) {
		for (SqlEntity vo : deptList) {
			((DeptVo) vo).setParent(ListUtil.findDepartId("" + ((DeptVo) vo).getParent(), deptList));
		}
	}

	/**
	 * 排序过滤
	 */
	public static void sortList(List<SqlEntity> list) {
		DeptVo vo = null;
		for (int i = 0; i < list.size(); i++) {
			vo = (DeptVo) list.get(i);
			if (vo.getParent() > vo.getId()) {
				int j = getDeptByParent(list, vo.getParent());
				if (i < j) {// 如果对象排序到后面去了就可以不用交换了，对象如果排位靠前则需要交换
					SqlEntity parentVo = list.get(j);
					list.set(i, parentVo);
					list.set(j, (SqlEntity)vo);
				}
			}
		}
	}

	/**
	 * 通过parentId 找dept对象
	 * 
	 * @param list
	 * @param parentId
	 * @return
	 */
	public static int getDeptByParent(List<SqlEntity> list, long parentId) {
		SqlEntity vo = null;
		for (int i = 0; i < list.size(); i++) {
			vo = list.get(i);
			if (vo.getId() == parentId) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 通过code取list中的对象
	 * 
	 * @param code
	 * @param list
	 * @return
	 */
	public static SqlEntity findEntity(String code, List<SqlEntity> list) {
		String entityCode = null;
		for (SqlEntity entity : list) {
			if (entity != null) {
				entityCode = entity.getCode();
				if (!StringHelper.isEmpty(entityCode) && entityCode.equals(code)) {
					return entity;
				}
			}
		}
		return null;
	}

	/**
	 * 截断数组，取出其中有值的一部分
	 * 
	 * @param objs
	 * @param length
	 * @return
	 */
	public static String[] cutArry(String[] source, int length) {
		String[] result = new String[length];
		System.arraycopy(source, 0, result, 0, length);
		return result;
	}

	/**
	 * 搜索list是否有对象
	 * 
	 * @param list
	 * @param code
	 * @return
	 */
	public static int find(List<Object[]> list, Object code) {
		for (Object[] obs : list) {
			if (obs != null && obs[0].equals(code)) {
				return Integer.parseInt(obs[1].toString());
			}
		}
		return -1;
	}

	/**
	 * 搜索list是否有对象
	 * 
	 * @param list
	 * @param code
	 * @return
	 */
	public static String find(List<String> list, String code) {
		for (String str : list) {
			if (str != null && str.equals(code)) {
				return code;
			}
		}
		return null;
	}
	
	/**
	 * 过滤掉null对象
	 * 
	 * @param list
	 * @return
	 */
	public static List<SqlEntity> filterNull(List<SqlEntity> list){
		List<SqlEntity> result = new ArrayList<SqlEntity>();
		for(SqlEntity object: list){
			if(object != null){
				result.add(object);
			}
		}
		return result;
	}
}
