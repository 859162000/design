package com.sinosoft.libertyoa.entity;

import java.io.Serializable;

/**
 * 合同审批
 * @author lirh
 *
 */
public class ContractApprove implements Serializable{

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 合同号
	 */
	private String contract_id;
	
	/**
	 * 合同分类
	 */
	private String contract_type;
	
	/**
	 * 合同种类
	 */
	private String contract_class;
	
	/**
	 * 合同阶段
	 */
	private String contract_stage;

	public String getContract_id() {
		return contract_id;
	}

	public void setContract_id(String contract_id) {
		this.contract_id = contract_id;
	}

	public String getContract_type() {
		return contract_type;
	}

	public void setContract_type(String contract_type) {
		this.contract_type = contract_type;
	}

	public String getContract_class() {
		return contract_class;
	}

	public void setContract_class(String contract_class) {
		this.contract_class = contract_class;
	}

	public String getContract_stage() {
		return contract_stage;
	}

	public void setContract_stage(String contract_stage) {
		this.contract_stage = contract_stage;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	 
	
}
