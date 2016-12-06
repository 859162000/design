package com.coco.entity;

import java.sql.Timestamp;
import java.util.Set;

/**
 * TUser entity. @author MyEclipse Persistence Tools
 */
public class TUser extends AbstractTUser implements java.io.Serializable {

	// Constructors

	/** default constructor */
	public TUser() {
	}

	/** minimal constructor */
	public TUser(TDept TDeptByCompanyId, TDept TDeptByDeptId, String code, String name, String status,
			String logonMode, Timestamp createTime, Timestamp modifyTime) {
		super(TDeptByCompanyId, TDeptByDeptId, code, name, status, logonMode, createTime, modifyTime);
	}

	/** full constructor */
	public TUser(TDept TDeptByCompanyId, TDept TDeptByDeptId, String code, String name, String email, String status,
			String bankName, String bankAccountNum, String bankAccountName, String logonMode, String logonPassword,
			Timestamp createTime, Long creatorId, Timestamp modifyTime, Long modifierId, String remarks, Set TUserRoles) {
		super(TDeptByCompanyId, TDeptByDeptId, code, name, email, status, bankName, bankAccountNum, bankAccountName,
				logonMode, logonPassword, createTime, creatorId, modifyTime, modifierId, remarks, TUserRoles);
	}

}
