package com.sinosoft.payment.webservice.simple.service;

import javax.jws.WebService;

import com.sinosoft.payment.webservice.simple.Constants;
import com.sinosoft.payment.webservice.simple.model.SimpleEntity;

/**
 * This class was generated by Apache CXF 3.1.6
 * 2016-05-11T15:18:20.373+08:00
 * Generated source version: 3.1.6
 * 
 */
@WebService(targetNamespace = Constants.WS_NAMESPACE, name = "SimpleService")
public interface SimpleService {

	public String query();
	
	public String queryEntity(SimpleEntity entity);
}
