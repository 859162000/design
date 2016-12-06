package org.wanwanframework.flower.jdbc.model;

/**
 * select u.userid, u.username, u.name, u.departmentcostcode from t_user u;
 * 
 * @author lirh
 *
 */
@SuppressWarnings("serial")
public class UserVo extends SqlEntityVo implements java.io.Serializable, SqlEntity {

	private String password = "4a7d1ed414474e4033ac29ccb8653d9b";// 瀵嗙爜
	private String chinaName;// 涓枃鍚�
	private String departmentcostcode;// 閮ㄩ棬鍚�
	private String companyid;// 鍏徃id
	private String email;
	private String mobile;
	private String telephone = " ";
	private String remark;

	private int sync_id;

	/**
	 * 榛樿璁剧疆鎻掑叆绫诲瀷涓篿nsert
	 */
	public UserVo() {
		this.type = SqlEntity.insert;
	}

	public UserVo(int id, String code, String chinaName, String departmentcostcode, String companyid) {
		super();
		this.id = id;
		this.code = code;
		this.chinaName = chinaName;
		this.departmentcostcode = departmentcostcode;
		this.companyid = companyid;
	}
 
	public String getChinaName() {
		return chinaName;
	}

	public void setChinaName(String name) {
		this.chinaName = name;
	}

	public String getDepartmentcostcode() {
		return departmentcostcode;
	}

	public void setDepartmentcostcode(String departmentcostcode) {
		this.departmentcostcode = departmentcostcode;
	}

	public String getCompanyid() {
		return companyid;
	}

	public void setCompanyid(String companyid) {
		this.companyid = companyid;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getSync_id() {
		return sync_id;
	}

	public void setSync_id(int sync_id) {
		this.sync_id = sync_id;
	}

	/**
	 * 鎻掑叆oralce琛ㄧ殑sql
	 * 
	 * @return
	 */
	public String toInsert() {
		String sql = "insert into t_user(id, code, name , dept_id, company_id, email,"
				+ "mobile, telephone, remarks, logon_password, sync_id) values('" + this.id + "','" + this.code + "','"
				+ this.toName() + "','" + this.departmentcostcode + "','" + this.companyid + "','" + this.email + "','"
				+ this.mobile + "','" + this.telephone + "','" + this.remark + "','" + this.password + "','"
				+ this.sync_id + "') ";
		return sql;
	}

	@Override
	public String toName() {
		String sqlName = this.chinaName + "(" + this.code + ")";
		return sqlName;
	}

	@Override
	public String toUpdate() {
		String sql = "update t_user set code='" + this.code + "'," + "name='" + this.toName() + "'," + "dept_id='"
				+ this.departmentcostcode + "'," + "company_id='" + this.companyid + "'," + "email='" + this.email + "',"
				+ "mobile='" + this.mobile + "'," + "telephone='" + this.telephone + "'," + "remarks='" + this.remark
				+ "'," + "logon_password='" + this.password + "'" + " where id=" + this.id;
		return sql;
	}

}
