package com.sinosoft.payment.webservice.simple;

import javax.xml.ws.Endpoint;

import com.sinosoft.payment.webservice.simple.service.SimpleServiceImpl;

/**
 * 简单webservice
 * 
 * @author
 *
 */
public class SimpleServer {

	public static String address = "http://coco:8080/cxf/webservice/webservice/readPaymentStatus";

	private SimpleServiceImpl service = new SimpleServiceImpl();

	public void publish() {
		Endpoint.publish(address, service);
	}

	public static void main(String[] args) {
		SimpleServer server = new SimpleServer();
		server.publish();
	}
}
