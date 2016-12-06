package org.wanwan.flower.jdbc.util;

import java.util.List;

import org.hibernate.annotations.common.util.StringHelper;
import org.wanwan.flower.jdbc.model.DeptVo;
import org.wanwan.flower.jdbc.model.SqlEntity;

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

	/**
	 * 根据部门code去找dept的id
	 * 
	 * @param code
	 * @return
	 */
	public static int findDepartId(String code, List<SqlEntity> deptList) {
		for (SqlEntity vo : deptList) {
			if (vo.getCode().equals(code)) {
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
			((DeptVo)vo).setParent(ListUtil.findDepartId("" + ((DeptVo)vo).getParent(), deptList));
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
					list.set(j, vo);
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
			if(entity != null){
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
	public static String[] cutArry(String[] source, int length){
		String[] result = new String[length];
		System.arraycopy(source, 0, result, 0, length);
		return result;
	}
}
