package com.sinosoft.payment.webservice.read;

import javax.servlet.ServletConfig;
import javax.xml.ws.Endpoint;

import org.apache.cxf.transport.servlet.CXFNonSpringServlet;

import com.sinosoft.payment.webservice.simple.service.SimpleServiceImpl;

public class PayReadServlet extends CXFNonSpringServlet{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2080598910444271487L;

	@Override
    protected void loadBus(ServletConfig servletConfig) {
        super.loadBus(servletConfig);
        Endpoint.publish("/webservice/readPaymentStatus", new SimpleServiceImpl());
        System.out.println("readPaymentStatus publish success...");
    }
}
