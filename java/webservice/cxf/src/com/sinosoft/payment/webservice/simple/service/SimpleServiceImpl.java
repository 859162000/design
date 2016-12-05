package com.sinosoft.payment.webservice.simple.service;

import javax.jws.WebService;

import com.sinosoft.payment.webservice.simple.Constants;
import com.sinosoft.payment.webservice.simple.model.SimpleEntity;

@WebService(targetNamespace = Constants.WS_NAMESPACE, name = "SimpleService")
public class SimpleServiceImpl implements SimpleService {

	@Override
	public String query() {
		return "query";
	}

	@Override
	public String queryEntity(SimpleEntity entity){
		return "vvvv:" + entity.toString();
	}
}