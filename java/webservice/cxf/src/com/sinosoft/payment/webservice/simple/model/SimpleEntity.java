package com.sinosoft.payment.webservice.simple.model;

import java.io.Serializable;
import java.math.BigDecimal;

@SuppressWarnings("serial")
public class SimpleEntity implements Serializable{

	private Integer id;
	private String code;
	private BigDecimal amount; 
	//private Date date;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

//	public Date getDate() {
//		return date;
//	}
//
//	public void setDate(Date date) {
//		this.date = date;
//	}

	@Override
	public String toString() {
		return "SimpleEntity [id=" + id + ", code=" + code + ", amount=" + amount + ", date=" + "]";
	}
	
}
