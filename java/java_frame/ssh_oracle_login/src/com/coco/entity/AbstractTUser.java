package com.coco.entity;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

/**
 * AbstractTUser entity provides the base persistence definition of the TUser entity. @author MyEclipse Persistence
 * Tools
 */

public abstract class AbstractTUser implements java.io.Serializable {

	// Fields

	private Long id;
	private TDept TDeptByCompanyId;
	private TDept TDeptByDeptId;
	private String code;
	private String name;
	private String email;
	private String status;
	private String bankName;
	private String bankAccountNum;
	private String bankAccountName;
	private String logonMode;
	private String logonPassword;
	private Timestamp createTime;
	private Long creatorId;
	private Timestamp modifyTime;
	private Long modifierId;
	private String remarks;
	private Set TUserRoles = new HashSet(0);

	// Constructors

	/** default constructor */
	public AbstractTUser() {
	}

	/** minimal constructor */
	public AbstractTUser(TDept TDeptByCompanyId, TDept TDeptByDeptId, String code, String name, String status,
			String logonMode, Timestamp createTime, Timestamp modifyTime) {
		this.TDeptByCompanyId = TDeptByCompanyId;
		this.TDeptByDeptId = TDeptByDeptId;
		this.code = code;
		this.name = name;
		this.status = status;
		this.logonMode = logonMode;
		this.createTime = createTime;
		this.modifyTime = modifyTime;
	}

	/** full constructor */
	public AbstractTUser(TDept TDeptByCompanyId, TDept TDeptByDeptId, String code, String name, String email,
			String status, String bankName, String bankAccountNum, String bankAccountName, String logonMode,
			String logonPassword, Timestamp createTime, Long creatorId, Timestamp modifyTime, Long modifierId,
			String remarks, Set TUserRoles) {
		this.TDeptByCompanyId = TDeptByCompanyId;
		this.TDeptByDeptId = TDeptByDeptId;
		this.code = code;
		this.name = name;
		this.email = email;
		this.status = status;
		this.bankName = bankName;
		this.bankAccountNum = bankAccountNum;
		this.bankAccountName = bankAccountName;
		this.logonMode = logonMode;
		this.logonPassword = logonPassword;
		this.createTime = createTime;
		this.creatorId = creatorId;
		this.modifyTime = modifyTime;
		this.modifierId = modifierId;
		this.remarks = remarks;
		this.TUserRoles = TUserRoles;
	}

	// Property accessors

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public TDept getTDeptByCompanyId() {
		return this.TDeptByCompanyId;
	}

	public void setTDeptByCompanyId(TDept TDeptByCompanyId) {
		this.TDeptByCompanyId = TDeptByCompanyId;
	}

	public TDept getTDeptByDeptId() {
		return this.TDeptByDeptId;
	}

	public void setTDeptByDeptId(TDept TDeptByDeptId) {
		this.TDeptByDeptId = TDeptByDeptId;
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

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getBankName() {
		return this.bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankAccountNum() {
		return this.bankAccountNum;
	}

	public void setBankAccountNum(String bankAccountNum) {
		this.bankAccountNum = bankAccountNum;
	}

	public String getBankAccountName() {
		return this.bankAccountName;
	}

	public void setBankAccountName(String bankAccountName) {
		this.bankAccountName = bankAccountName;
	}

	public String getLogonMode() {
		return this.logonMode;
	}

	public void setLogonMode(String logonMode) {
		this.logonMode = logonMode;
	}

	public String getLogonPassword() {
		return this.logonPassword;
	}

	public void setLogonPassword(String logonPassword) {
		this.logonPassword = logonPassword;
	}

	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getCreatorId() {
		return this.creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Timestamp getModifyTime() {
		return this.modifyTime;
	}

	public void setModifyTime(Timestamp modifyTime) {
		this.modifyTime = modifyTime;
	}

	public Long getModifierId() {
		return this.modifierId;
	}

	public void setModifierId(Long modifierId) {
		this.modifierId = modifierId;
	}

	public String getRemarks() {
		return this.remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Set getTUserRoles() {
		return this.TUserRoles;
	}

	public void setTUserRoles(Set TUserRoles) {
		this.TUserRoles = TUserRoles;
	}

}