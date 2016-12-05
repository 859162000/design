package com.sinosoft.payment.webservice.test;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import com.sinosoft.payment.webservice.pay.PayServicePortType;
import com.sinosoft.payment.webservice.pay.xsd.PayEntity;

/**
 * 支付接口客户端
 * 
 * @author
 *
 */
public class PayClient {

	public static final String url = "http://10.132.21.40:9005/axis2/services/PayService";

	private JaxWsProxyFactoryBean factory = new JaxWsProxyFactoryBean();

	public PayClient() {
		factory.setServiceClass(PayServicePortType.class);
		factory.setAddress(url);
	}

	/**
	 * 支付查询
	 * 
	 * @param entity
	 * @return
	 */
	public PayEntity query(PayEntity entity) {
		PayServicePortType service = (PayServicePortType) factory.create();
		return service.query(entity);
	}

	/**
	 * 支付
	 * 
	 * @param entity
	 * @return
	 */
	public PayEntity pay(PayEntity entity) {
		PayServicePortType service = (PayServicePortType) factory.create();
		return service.pay(entity);
	}

	/**
	 * 支付来源
	 * 
	 * @param entity
	 * @return
	 */
	public PayEntity payForm(PayEntity entity) {
		PayServicePortType service = (PayServicePortType) factory.create();
		return service.payFrom("9", entity);
	}
}
