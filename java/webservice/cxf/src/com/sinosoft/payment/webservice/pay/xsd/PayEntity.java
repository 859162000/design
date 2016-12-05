
package com.sinosoft.payment.webservice.pay.xsd;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PayEntity", propOrder = { "certiId", "certiNo", "claimNo", "creditNo", "currency", "id", "operateDate",
		"payFee", "payStatus", "payeeBankAccount", "payeeBankCode", "payeeBankName", "payeeName", "payerBankAccount",
		"payerBankCode", "payerBankName", "payerName", "payrefUnit", "policyNo", "properties", "requestNo", "returnMsg",
		"txCode", "use" })
public class PayEntity {

	@XmlElementRef(name = "certiId", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> certiId;
	@XmlElementRef(name = "certiNo", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> certiNo;
	@XmlElementRef(name = "claimNo", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> claimNo;
	@XmlElementRef(name = "creditNo", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> creditNo;
	@XmlElementRef(name = "currency", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> currency;
	@XmlElementRef(name = "id", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> id;
	@XmlElementRef(name = "operateDate", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<XMLGregorianCalendar> operateDate;
	protected Double payFee;
	@XmlElementRef(name = "payStatus", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payStatus;
	@XmlElementRef(name = "payeeBankAccount", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payeeBankAccount;
	@XmlElementRef(name = "payeeBankCode", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payeeBankCode;
	@XmlElementRef(name = "payeeBankName", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payeeBankName;
	@XmlElementRef(name = "payeeName", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payeeName;
	@XmlElementRef(name = "payerBankAccount", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payerBankAccount;
	@XmlElementRef(name = "payerBankCode", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payerBankCode;
	@XmlElementRef(name = "payerBankName", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payerBankName;
	@XmlElementRef(name = "payerName", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payerName;
	@XmlElementRef(name = "payrefUnit", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> payrefUnit;
	@XmlElementRef(name = "policyNo", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> policyNo;
	@XmlElement(nillable = true)
	protected List<String> properties;
	@XmlElementRef(name = "requestNo", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> requestNo;
	@XmlElementRef(name = "returnMsg", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> returnMsg;
	@XmlElementRef(name = "txCode", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> txCode;
	@XmlElementRef(name = "use", namespace = "http://pay.webservice.payment.sinosoft.com/xsd", type = JAXBElement.class, required = false)
	protected JAXBElement<String> use;

	/**
	 * 获取certiId属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getCertiId() {
		return certiId;
	}

	/**
	 * 设置certiId属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setCertiId(JAXBElement<String> value) {
		this.certiId = value;
	}

	/**
	 * 获取certiNo属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getCertiNo() {
		return certiNo;
	}

	/**
	 * 设置certiNo属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setCertiNo(JAXBElement<String> value) {
		this.certiNo = value;
	}

	/**
	 * 获取claimNo属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getClaimNo() {
		return claimNo;
	}

	/**
	 * 设置claimNo属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setClaimNo(JAXBElement<String> value) {
		this.claimNo = value;
	}

	/**
	 * 获取creditNo属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getCreditNo() {
		return creditNo;
	}

	/**
	 * 设置creditNo属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setCreditNo(JAXBElement<String> value) {
		this.creditNo = value;
	}

	/**
	 * 获取currency属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getCurrency() {
		return currency;
	}

	/**
	 * 设置currency属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setCurrency(JAXBElement<String> value) {
		this.currency = value;
	}

	/**
	 * 获取id属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getId() {
		return id;
	}

	/**
	 * 设置id属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setId(JAXBElement<String> value) {
		this.id = value;
	}

	/**
	 * 获取operateDate属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link XMLGregorianCalendar }{@code >}
	 * 
	 */
	public JAXBElement<XMLGregorianCalendar> getOperateDate() {
		return operateDate;
	}

	/**
	 * 设置operateDate属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link XMLGregorianCalendar }{@code >}
	 * 
	 */
	public void setOperateDate(JAXBElement<XMLGregorianCalendar> value) {
		this.operateDate = value;
	}

	/**
	 * 获取payFee属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link Double }
	 * 
	 */
	public Double getPayFee() {
		return payFee;
	}

	/**
	 * 设置payFee属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link Double }
	 * 
	 */
	public void setPayFee(Double value) {
		this.payFee = value;
	}

	/**
	 * 获取payStatus属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayStatus() {
		return payStatus;
	}

	/**
	 * 设置payStatus属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayStatus(JAXBElement<String> value) {
		this.payStatus = value;
	}

	/**
	 * 获取payeeBankAccount属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayeeBankAccount() {
		return payeeBankAccount;
	}

	/**
	 * 设置payeeBankAccount属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayeeBankAccount(JAXBElement<String> value) {
		this.payeeBankAccount = value;
	}

	/**
	 * 获取payeeBankCode属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayeeBankCode() {
		return payeeBankCode;
	}

	/**
	 * 设置payeeBankCode属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayeeBankCode(JAXBElement<String> value) {
		this.payeeBankCode = value;
	}

	/**
	 * 获取payeeBankName属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayeeBankName() {
		return payeeBankName;
	}

	/**
	 * 设置payeeBankName属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayeeBankName(JAXBElement<String> value) {
		this.payeeBankName = value;
	}

	/**
	 * 获取payeeName属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayeeName() {
		return payeeName;
	}

	/**
	 * 设置payeeName属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayeeName(JAXBElement<String> value) {
		this.payeeName = value;
	}

	/**
	 * 获取payerBankAccount属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayerBankAccount() {
		return payerBankAccount;
	}

	/**
	 * 设置payerBankAccount属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayerBankAccount(JAXBElement<String> value) {
		this.payerBankAccount = value;
	}

	/**
	 * 获取payerBankCode属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayerBankCode() {
		return payerBankCode;
	}

	/**
	 * 设置payerBankCode属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayerBankCode(JAXBElement<String> value) {
		this.payerBankCode = value;
	}

	/**
	 * 获取payerBankName属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayerBankName() {
		return payerBankName;
	}

	/**
	 * 设置payerBankName属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayerBankName(JAXBElement<String> value) {
		this.payerBankName = value;
	}

	/**
	 * 获取payerName属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayerName() {
		return payerName;
	}

	/**
	 * 设置payerName属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayerName(JAXBElement<String> value) {
		this.payerName = value;
	}

	/**
	 * 获取payrefUnit属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPayrefUnit() {
		return payrefUnit;
	}

	/**
	 * 设置payrefUnit属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPayrefUnit(JAXBElement<String> value) {
		this.payrefUnit = value;
	}

	/**
	 * 获取policyNo属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getPolicyNo() {
		return policyNo;
	}

	/**
	 * 设置policyNo属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setPolicyNo(JAXBElement<String> value) {
		this.policyNo = value;
	}

	/**
	 * Gets the value of the properties property.
	 * 
	 * <p>
	 * This accessor method returns a reference to the live list,
	 * not a snapshot. Therefore any modification you make to the
	 * returned list will be present inside the JAXB object.
	 * This is why there is not a <CODE>set</CODE> method for the properties property.
	 * 
	 * <p>
	 * For example, to add a new item, do as follows:
	 * 
	 * <pre>
	 * getProperties().add(newItem);
	 * </pre>
	 * 
	 * 
	 * <p>
	 * Objects of the following type(s) are allowed in the list
	 * {@link String }
	 * 
	 * 
	 */
	public List<String> getProperties() {
		if (properties == null) {
			properties = new ArrayList<String>();
		}
		return this.properties;
	}

	/**
	 * 获取requestNo属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getRequestNo() {
		return requestNo;
	}

	/**
	 * 设置requestNo属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setRequestNo(JAXBElement<String> value) {
		this.requestNo = value;
	}

	/**
	 * 获取returnMsg属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getReturnMsg() {
		return returnMsg;
	}

	/**
	 * 设置returnMsg属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setReturnMsg(JAXBElement<String> value) {
		this.returnMsg = value;
	}

	/**
	 * 获取txCode属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getTxCode() {
		return txCode;
	}

	/**
	 * 设置txCode属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setTxCode(JAXBElement<String> value) {
		this.txCode = value;
	}

	/**
	 * 获取use属性的值。
	 * 
	 * @return
	 * 		possible object is
	 *         {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public JAXBElement<String> getUse() {
		return use;
	}

	/**
	 * 设置use属性的值。
	 * 
	 * @param value
	 *            allowed object is
	 *            {@link JAXBElement }{@code <}{@link String }{@code >}
	 * 
	 */
	public void setUse(JAXBElement<String> value) {
		this.use = value;
	}

}
