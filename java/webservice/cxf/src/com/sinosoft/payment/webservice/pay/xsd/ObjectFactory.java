
package com.sinosoft.payment.webservice.pay.xsd;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.sinosoft.payment.webservice.pay.xsd package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _PayEntityCertiId_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "certiId");
    private final static QName _PayEntityCertiNo_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "certiNo");
    private final static QName _PayEntityClaimNo_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "claimNo");
    private final static QName _PayEntityCreditNo_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "creditNo");
    private final static QName _PayEntityCurrency_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "currency");
    private final static QName _PayEntityId_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "id");
    private final static QName _PayEntityOperateDate_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "operateDate");
    private final static QName _PayEntityPayStatus_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payStatus");
    private final static QName _PayEntityPayeeBankAccount_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payeeBankAccount");
    private final static QName _PayEntityPayeeBankCode_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payeeBankCode");
    private final static QName _PayEntityPayeeBankName_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payeeBankName");
    private final static QName _PayEntityPayeeName_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payeeName");
    private final static QName _PayEntityPayerBankAccount_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payerBankAccount");
    private final static QName _PayEntityPayerBankCode_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payerBankCode");
    private final static QName _PayEntityPayerBankName_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payerBankName");
    private final static QName _PayEntityPayerName_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payerName");
    private final static QName _PayEntityPayrefUnit_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "payrefUnit");
    private final static QName _PayEntityPolicyNo_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "policyNo");
    private final static QName _PayEntityRequestNo_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "requestNo");
    private final static QName _PayEntityReturnMsg_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "returnMsg");
    private final static QName _PayEntityTxCode_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "txCode");
    private final static QName _PayEntityUse_QNAME = new QName("http://pay.webservice.payment.sinosoft.com/xsd", "use");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.sinosoft.payment.webservice.pay.xsd
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link PayEntity }
     * 
     */
    public PayEntity createPayEntity() {
        return new PayEntity();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "certiId", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityCertiId(String value) {
        return new JAXBElement<String>(_PayEntityCertiId_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "certiNo", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityCertiNo(String value) {
        return new JAXBElement<String>(_PayEntityCertiNo_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "claimNo", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityClaimNo(String value) {
        return new JAXBElement<String>(_PayEntityClaimNo_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "creditNo", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityCreditNo(String value) {
        return new JAXBElement<String>(_PayEntityCreditNo_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "currency", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityCurrency(String value) {
        return new JAXBElement<String>(_PayEntityCurrency_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "id", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityId(String value) {
        return new JAXBElement<String>(_PayEntityId_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link XMLGregorianCalendar }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "operateDate", scope = PayEntity.class)
    public JAXBElement<XMLGregorianCalendar> createPayEntityOperateDate(XMLGregorianCalendar value) {
        return new JAXBElement<XMLGregorianCalendar>(_PayEntityOperateDate_QNAME, XMLGregorianCalendar.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payStatus", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayStatus(String value) {
        return new JAXBElement<String>(_PayEntityPayStatus_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payeeBankAccount", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayeeBankAccount(String value) {
        return new JAXBElement<String>(_PayEntityPayeeBankAccount_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payeeBankCode", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayeeBankCode(String value) {
        return new JAXBElement<String>(_PayEntityPayeeBankCode_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payeeBankName", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayeeBankName(String value) {
        return new JAXBElement<String>(_PayEntityPayeeBankName_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payeeName", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayeeName(String value) {
        return new JAXBElement<String>(_PayEntityPayeeName_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payerBankAccount", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayerBankAccount(String value) {
        return new JAXBElement<String>(_PayEntityPayerBankAccount_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payerBankCode", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayerBankCode(String value) {
        return new JAXBElement<String>(_PayEntityPayerBankCode_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payerBankName", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayerBankName(String value) {
        return new JAXBElement<String>(_PayEntityPayerBankName_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payerName", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayerName(String value) {
        return new JAXBElement<String>(_PayEntityPayerName_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "payrefUnit", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPayrefUnit(String value) {
        return new JAXBElement<String>(_PayEntityPayrefUnit_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "policyNo", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityPolicyNo(String value) {
        return new JAXBElement<String>(_PayEntityPolicyNo_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "requestNo", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityRequestNo(String value) {
        return new JAXBElement<String>(_PayEntityRequestNo_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "returnMsg", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityReturnMsg(String value) {
        return new JAXBElement<String>(_PayEntityReturnMsg_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "txCode", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityTxCode(String value) {
        return new JAXBElement<String>(_PayEntityTxCode_QNAME, String.class, PayEntity.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com/xsd", name = "use", scope = PayEntity.class)
    public JAXBElement<String> createPayEntityUse(String value) {
        return new JAXBElement<String>(_PayEntityUse_QNAME, String.class, PayEntity.class, value);
    }

}
