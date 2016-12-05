package com.sinosoft.payment.webservice.read.service;

import javax.jws.WebService;

import com.sinosoft.payment.webservice.pay.xsd.PayEntity;

@WebService(targetNamespace = "com.sinosoft.payment.webservice.read.service.PayReadService", name = "PayReadService")
public class PayReadServiceImpl implements PayReadService{

	@Override
	public void payRead(PayEntity entity) {
		System.out.println("vvvv"); 
	}

}
