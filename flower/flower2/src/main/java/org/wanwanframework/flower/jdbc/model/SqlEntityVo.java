package org.wanwanframework.flower.jdbc.model;

/**
 * 鎵�湁springjdbc瀹炰綋绫诲璞＄殑鐖剁被
 * 
 * @author
 *
 */
public abstract class SqlEntityVo {

	protected int id;
	protected String code;// 浠ｇ爜
	protected String name;// 瀵瑰簲鏁版嵁搴撹〃涓殑name

	protected String type;// sql璇彞绫诲瀷

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
