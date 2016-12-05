package com.sinosoft.payment.webservice.simple;

import java.math.BigDecimal;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import com.sinosoft.payment.webservice.simple.model.SimpleEntity;
import com.sinosoft.payment.webservice.simple.service.SimpleService;

/**
 * 调用webservice的客户端
 * 
 * @author
 *
 */
public class SimpleClient {

	JaxWsProxyFactoryBean svr = new JaxWsProxyFactoryBean();

	public SimpleClient() {
		svr.setServiceClass(SimpleService.class);
		svr.setAddress(SimpleServer.address);
	}

	public String query() {
		SimpleService service = (SimpleService) svr.create();
		return service.query();
	}
	
	public String queryEntity() {
		SimpleService service = (SimpleService) svr.create();
		SimpleEntity entity = new SimpleEntity();
		entity.setId(20160511);
		entity.setCode("vvvv");
		entity.setAmount(new BigDecimal("" + 1000));
		
		return service.queryEntity(entity);
	}

	public static void main(String[] args) {
		SimpleClient client = new SimpleClient();
		String queryEntity = client.queryEntity();
		System.out.println("entity:" + queryEntity);
	}
}
