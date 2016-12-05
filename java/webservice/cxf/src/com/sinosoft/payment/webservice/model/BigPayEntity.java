package com.sinosoft.payment.webservice.model;

import java.util.Date;
import java.util.GregorianCalendar;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import com.sinosoft.payment.webservice.pay.xsd.ObjectFactory;
import com.sinosoft.payment.webservice.pay.xsd.PayEntity;

public class BigPayEntity extends PayEntity {

	ObjectFactory factory = new ObjectFactory();

	public void setCertiId(String value) {
		super.setCertiId(factory.createPayEntityCertiId(value));
	}

	public void setCertiNo(String value) {

		super.setCertiNo(factory.createPayEntityCertiNo(value));
	}

	public void setClaimNo(String value) {

		super.setClaimNo(factory.createPayEntityClaimNo(value));
	}

	public void setCreditNo(String value) {

		super.setCreditNo(factory.createPayEntityCreditNo(value));
	}

	public void setCurrency(String value) {

		super.setCurrency(factory.createPayEntityCurrency(value));
	}

	public void setId(String value) {

		super.setId(factory.createPayEntityId(value));
	}

	public void setOperateDate(Date value) {
	    GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value);
		XMLGregorianCalendar calendar = null;
		try {
			calendar = DatatypeFactory.newInstance().newXMLGregorianCalendar(cal);
			super.setOperateDate(factory.createPayEntityOperateDate(calendar));
		} catch (DatatypeConfigurationException e) { 
			e.printStackTrace();
		}	
	}

	public void setPayStatus(String value) {

		super.setPayStatus(factory.createPayEntityPayStatus(value));
	}

	public void setPayeeBankAccount(String value) {

		super.setPayeeBankAccount(factory.createPayEntityPayeeBankAccount(value));
	}

	public void setPayeeBankCode(String value) {

		super.setPayeeBankCode(factory.createPayEntityPayeeBankCode(value));
	}

	public void setPayeeBankName(String value) {

		super.setPayeeBankName(factory.createPayEntityPayeeBankName(value));
	}

	public void setPayeeName(String value) {

		super.setPayeeName(factory.createPayEntityPayeeName(value));
	}

	public void setPayerBankAccount(String value) {

		super.setPayerBankAccount(factory.createPayEntityPayerBankAccount(value));
	}

	public void setPayerBankCode(String value) {

		super.setPayerBankCode(factory.createPayEntityPayerBankCode(value));
	}

	public void setPayerBankName(String value) {

		super.setPayerBankName(factory.createPayEntityPayerBankName(value));
	}

	public void setPayerName(String value) {

		super.setPayerName(factory.createPayEntityPayerName(value));
	}

	public void setPayrefUnit(String value) {

		super.setPayrefUnit(factory.createPayEntityPayrefUnit(value));
	}

	public void setPolicyNo(String value) {

		super.setPolicyNo(factory.createPayEntityPolicyNo(value));
	}

	public void setRequestNo(String value) {

		super.setRequestNo(factory.createPayEntityRequestNo(value));
	}

	public void setReturnMsg(String value) {

		super.setReturnMsg(factory.createPayEntityReturnMsg(value));
	}

	public void setTxCode(String value) {

		super.setTxCode(factory.createPayEntityTxCode(value));
	}

	public void setUse(String value) {

		super.setUse(factory.createPayEntityUse(value));
	}

}
