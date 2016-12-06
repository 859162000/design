package org.wanwan.plugin.utils;

import java.util.HashMap;
import java.util.Map;

public class SqlStringUtil {

	/**
	 * 获取查询语句
	 * 
	 * @param table
	 * @param fields
	 * @return
	 */
	public static String select(String table, String[] fields){
		String sql = "select ";
		for (int i = 0; i < fields.length; i++) {
			sql += fields[i] + ",";
		}
		sql = sql.substring(0, sql.length() - 1);
		sql += " from " + table;
		return sql;
	}
	
	public static String update(String table, String where, Map<String, Object> map){
		String sql = "update " + table + " where " + where + ", set ";
		Object value = null;
		for(String key : map.keySet()){
			value = map.get(key);
			sql += key + " = " + "'"+value+"',"; 
		}
		sql = sql.substring(0, sql.length() - 1);
		return sql;
	}
	
	public static void main(String[] args) {
		String sql = select("t_user", new String[]{"id", "code", "name"});
		System.out.println("sql:" + sql);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("code", "vvvv");
		map.put("name", "cc");
		sql = update("t_user", "id='0'", map);
		System.out.println("sql:" + sql);
	}
}
