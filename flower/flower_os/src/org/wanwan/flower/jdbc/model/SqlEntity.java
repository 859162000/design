package org.wanwan.flower.jdbc.model;

public interface SqlEntity {

	public static final String update = "1";

	public static final String insert = "0";

	public String toInsert();

	public String toName();

	public String toUpdate();
	
	/**
	 * 根据type自动处理sql语句是insert还是update
	 * 
	 * @return
	 */
	public String toSql();

	/**
	 * 获取本实体的id
	 * 
	 * @return
	 */
	public int getId();
	
	/**
	 * 获取本实体的code，在数据库中是唯一的字段
	 * 
	 * @return
	 */
	public String getCode();

	public String getType();

	public void setType(String type);

}
