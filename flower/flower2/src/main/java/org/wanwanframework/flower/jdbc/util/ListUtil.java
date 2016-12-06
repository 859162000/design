package org.wanwanframework.flower.jdbc.util;

import java.util.List;

import org.wanwanframework.flower.jdbc.model.DeptVo;
import org.wanwanframework.flower.jdbc.model.SqlEntity;

/**
 * 鍚屾AD鏃舵墍鏈変笌List鏈夊叧鐨勬搷浣滅粺涓�斁缃殑宸ュ叿绫�
 * 
 * @author 
 *
 */
public class ListUtil {

	/**
	 * 鍒ゆ柇涓�釜瀛楃涓叉槸鍚︽槸鏁板瓧
	 * 
	 * @param id
	 * @return
	 */
	public static boolean isNumber(String id) {
		boolean isNum = id.matches("\\d+");
		return isNum;
	}

	/**
	 * 鏍规嵁閮ㄩ棬code鍘绘壘dept鐨刬d
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
	 * 灏嗗杩沺arent灞炴�閲岀殑dept_code杞寲涓篸ept_id
	 * 
	 * @param deptList
	 */
	public static void toDepartmentId(List<SqlEntity> deptList) {
		for (SqlEntity vo : deptList) {
			((DeptVo)vo).setParent(ListUtil.findDepartId("" + ((DeptVo)vo).getParent(), deptList));
		}
	}

	/**
	 * 鎺掑簭杩囨护
	 */
	public static void sortList(List<SqlEntity> list) {
		DeptVo vo = null;
		for (int i = 0; i < list.size(); i++) {
			vo = (DeptVo) list.get(i);
			if (vo.getParent() > vo.getId()) {
				int j = getDeptByParent(list, vo.getParent());
				if (i < j) {// 濡傛灉瀵硅薄鎺掑簭鍒板悗闈㈠幓浜嗗氨鍙互涓嶇敤浜ゆ崲浜嗭紝瀵硅薄濡傛灉鎺掍綅闈犲墠鍒欓渶瑕佷氦鎹�
					SqlEntity parentVo = list.get(j);
					list.set(i, parentVo);
					list.set(j, vo);
				}
			}
		}
	}

	/**
	 * 閫氳繃parentId 鎵綿ept瀵硅薄
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
	 * 閫氳繃code鍙杔ist涓殑瀵硅薄
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
				if (entityCode != null && entityCode.equals(code)) {
					return entity;
				}
			} 
		}
		return null;
	}
	
	/**
	 * 鎴柇鏁扮粍锛屽彇鍑哄叾涓湁鍊肩殑涓�儴鍒�
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
