
package com.sinosoft.payment.webservice.pay;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;
import com.sinosoft.payment.webservice.pay.xsd.PayEntity;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.sinosoft.payment.webservice.pay package. 
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

    private final static QName _QueryEntity_QNAME = new QName("http://pay.webservice.payment.sinosoft.com", "entity");
    private final static QName _QueryResponseReturn_QNAME = new QName("http://pay.webservice.payment.sinosoft.com", "return");
    private final static QName _PayFromSource_QNAME = new QName("http://pay.webservice.payment.sinosoft.com", "source");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.sinosoft.payment.webservice.pay
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link Query }
     * 
     */
    public Query createQuery() {
        return new Query();
    }

    /**
     * Create an instance of {@link QueryResponse }
     * 
     */
    public QueryResponse createQueryResponse() {
        return new QueryResponse();
    }

    /**
     * Create an instance of {@link PayFrom }
     * 
     */
    public PayFrom createPayFrom() {
        return new PayFrom();
    }

    /**
     * Create an instance of {@link PayFromResponse }
     * 
     */
    public PayFromResponse createPayFromResponse() {
        return new PayFromResponse();
    }

    /**
     * Create an instance of {@link Pay }
     * 
     */
    public Pay createPay() {
        return new Pay();
    }

    /**
     * Create an instance of {@link PayResponse }
     * 
     */
    public PayResponse createPayResponse() {
        return new PayResponse();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "entity", scope = Query.class)
    public JAXBElement<PayEntity> createQueryEntity(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryEntity_QNAME, PayEntity.class, Query.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "return", scope = QueryResponse.class)
    public JAXBElement<PayEntity> createQueryResponseReturn(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryResponseReturn_QNAME, PayEntity.class, QueryResponse.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "source", scope = PayFrom.class)
    public JAXBElement<String> createPayFromSource(String value) {
        return new JAXBElement<String>(_PayFromSource_QNAME, String.class, PayFrom.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "entity", scope = PayFrom.class)
    public JAXBElement<PayEntity> createPayFromEntity(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryEntity_QNAME, PayEntity.class, PayFrom.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "return", scope = PayFromResponse.class)
    public JAXBElement<PayEntity> createPayFromResponseReturn(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryResponseReturn_QNAME, PayEntity.class, PayFromResponse.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "entity", scope = Pay.class)
    public JAXBElement<PayEntity> createPayEntity(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryEntity_QNAME, PayEntity.class, Pay.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PayEntity }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://pay.webservice.payment.sinosoft.com", name = "return", scope = PayResponse.class)
    public JAXBElement<PayEntity> createPayResponseReturn(PayEntity value) {
        return new JAXBElement<PayEntity>(_QueryResponseReturn_QNAME, PayEntity.class, PayResponse.class, value);
    }

}
