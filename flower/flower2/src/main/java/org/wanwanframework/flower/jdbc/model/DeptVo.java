package org.wanwanframework.flower.jdbc.model;

/**
 * 同步部门表的对象
 * 
 * @author coco
 *
 */
@SuppressWarnings({ "serial", "rawtypes" })
public class DeptVo extends SqlEntityVo implements java.io.Serializable, Comparable, SqlEntity {
 
	private long parent;
	private int company;
	private String chinaName;
	private int sync_id;

	/**
	 * 默认设置插入类型为insert
	 */
	public DeptVo() {
		this.type = SqlEntity.insert;
	}

	/** minimal constructor */
	public DeptVo(int id, int parent, int company, String code, String name) {
		this.id = id;
		this.parent = parent;
		this.company = company;
		this.code = code;
		this.name = name;
	}


	public long getParent() {
		return this.parent;
	}

	public void setParent(long parent) {
		this.parent = parent;
	}

	public int getCompany() {
		return this.company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
  
	public String getChinaName() {
		return chinaName;
	}

	public void setChinaName(String chinaName) {
		this.chinaName = chinaName;
	}

	/**
	 * 插入数据的jdbc
	 * 
	 * @return
	 */
	public String toInsert() {
		String sql = "insert into t_dept " + "(id, code, name , parent_id, company_id, sync_id)  values" + "(" + "'"
				+ this.getId() + "'," + "'" + this.getCode() + "'," + "'" + this.toName() + "'," + "'"
				+ this.getParent() + "','" + this.getCompany() + "','" + this.getSync_id() + "') ";
		return sql;
	}

	/**
	 * 给部门list派系，先排序parent，再排序id
	 */
	@Override
	public int compareTo(Object o) {
		if (o instanceof DeptVo) {
			DeptVo s = (DeptVo) o;
			if (this.id > s.id) {
				return 1;// 排在后面
			} else if (this.id == s.id) {
				return 0;
			} else {
				return -1;
			}
		}
		return -1;
	}

	@Override
	public String toName() {
		String sqlName = this.chinaName.trim() + "(" + this.name + ")";
		return sqlName;
	}

	public int getSync_id() {
		return sync_id;
	}

	public void setSync_id(int sync_id) {
		this.sync_id = sync_id;
	}

	@Override
	public String toUpdate() {
		// 组装更新的sql语句
		String sql = "update t_dept set code='" + this.code + "'," + "name='" + this.toName() + "'," + "parent_id='"
				+ this.parent + "'," + "company_id='" + this.company + "'," + "sync_id='" + this.sync_id + "'"
				+ " where id=" + this.id;
		return sql;
	}


}