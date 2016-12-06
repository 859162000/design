package org.wanwan.flower.jdbc.model;

/**
 * 所有springjdbc实体类对象的父类
 * 
 * @author
 *
 */
public abstract class SqlEntityVo {

	protected int id;
	protected String code;// 代码
	protected String name;// 对应数据库表中的name

	protected String type;// sql语句类型

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String toInsert() {
		return null;
	}

	public String toUpdate() {
		return null;
	}

	public String toSql() {
		if (type != null && type.equals(SqlEntity.insert)) {
			return toInsert();
		} else {
			return toUpdate();
		}
	}
}
