
package com.sinosoft.payment.webservice.pay;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.sinosoft.payment.webservice.pay.xsd.PayEntity;


/**
 * <p>anonymous complex type�� Java �ࡣ
 * 
 * <p>����ģʽƬ��ָ�������ڴ����е�Ԥ�����ݡ�
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="source" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="entity" type="{http://pay.webservice.payment.sinosoft.com/xsd}PayEntity" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "source",
    "entity"
})
@XmlRootElement(name = "payFrom")
public class PayFrom {

    @XmlElementRef(name = "source", namespace = "http://pay.webservice.payment.sinosoft.com", type = JAXBElement.class, required = false)
    protected JAXBElement<String> source;
    @XmlElementRef(name = "entity", namespace = "http://pay.webservice.payment.sinosoft.com", type = JAXBElement.class, required = false)
    protected JAXBElement<PayEntity> entity;

    /**
     * ��ȡsource���Ե�ֵ��
     * 
     * @return
     *     possible object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public JAXBElement<String> getSource() {
        return source;
    }

    /**
     * ����source���Ե�ֵ��
     * 
     * @param value
     *     allowed object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public void setSource(JAXBElement<String> value) {
        this.source = value;
    }

    /**
     * ��ȡentity���Ե�ֵ��
     * 
     * @return
     *     possible object is
     *     {@link JAXBElement }{@code <}{@link PayEntity }{@code >}
     *     
     */
    public JAXBElement<PayEntity> getEntity() {
        return entity;
    }

    /**
     * ����entity���Ե�ֵ��
     * 
     * @param value
     *     allowed object is
     *     {@link JAXBElement }{@code <}{@link PayEntity }{@code >}
     *     
     */
    public void setEntity(JAXBElement<PayEntity> value) {
        this.entity = value;
    }

}
