package com.sinosoft.payment.webservice.pay;

import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import javax.xml.ws.Service;

/**
 * This class was generated by Apache CXF 3.1.6
 * 2016-05-11T14:37:04.978+08:00
 * Generated source version: 3.1.6
 * 
 */
@WebServiceClient(name = "PayService", 
                  wsdlLocation = "http://10.132.21.40:9005/axis2/services/PayService?wsdl",
                  targetNamespace = "http://pay.webservice.payment.sinosoft.com") 
public class PayService extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://pay.webservice.payment.sinosoft.com", "PayService");
    public final static QName PayServiceHttpSoap11Endpoint = new QName("http://pay.webservice.payment.sinosoft.com", "PayServiceHttpSoap11Endpoint");
    public final static QName PayServiceHttpEndpoint = new QName("http://pay.webservice.payment.sinosoft.com", "PayServiceHttpEndpoint");
    public final static QName PayServiceHttpSoap12Endpoint = new QName("http://pay.webservice.payment.sinosoft.com", "PayServiceHttpSoap12Endpoint");
    static {
        URL url = null;
        try {
            url = new URL("http://10.132.21.40:9005/axis2/services/PayService?wsdl");
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(PayService.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "http://10.132.21.40:9005/axis2/services/PayService?wsdl");
        }
        WSDL_LOCATION = url;
    }

    public PayService(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public PayService(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public PayService() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    public PayService(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    public PayService(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    public PayService(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }    




    /**
     *
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpSoap11Endpoint")
    public PayServicePortType getPayServiceHttpSoap11Endpoint() {
        return super.getPort(PayServiceHttpSoap11Endpoint, PayServicePortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpSoap11Endpoint")
    public PayServicePortType getPayServiceHttpSoap11Endpoint(WebServiceFeature... features) {
        return super.getPort(PayServiceHttpSoap11Endpoint, PayServicePortType.class, features);
    }


    /**
     *
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpEndpoint")
    public PayServicePortType getPayServiceHttpEndpoint() {
        return super.getPort(PayServiceHttpEndpoint, PayServicePortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpEndpoint")
    public PayServicePortType getPayServiceHttpEndpoint(WebServiceFeature... features) {
        return super.getPort(PayServiceHttpEndpoint, PayServicePortType.class, features);
    }


    /**
     *
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpSoap12Endpoint")
    public PayServicePortType getPayServiceHttpSoap12Endpoint() {
        return super.getPort(PayServiceHttpSoap12Endpoint, PayServicePortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns PayServicePortType
     */
    @WebEndpoint(name = "PayServiceHttpSoap12Endpoint")
    public PayServicePortType getPayServiceHttpSoap12Endpoint(WebServiceFeature... features) {
        return super.getPort(PayServiceHttpSoap12Endpoint, PayServicePortType.class, features);
    }

}