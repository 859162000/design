package com.sinosoft.payment.webservice.test;

import java.util.Date;

import com.sinosoft.payment.webservice.model.BigPayEntity;
import com.sinosoft.payment.webservice.pay.xsd.PayEntity;

public class PayClientTest {
	
	public static PayClient client = new PayClient();
	public static PayEntity queryEntity = null;
	
	public static String certiId = "22285guuuctvvvv";//业务ID 	
	
	public static void testPayForm(){
		BigPayEntity payEntity = new BigPayEntity(); 
		Date date = new Date();
		
		payEntity.setCertiId("certiId");//业务ID 								1
		payEntity.setCertiNo("222222");//业务号									1
		payEntity.setClaimNo("222222");//CAS的赔案号								1
		payEntity.setPolicyNo("222222");//保单号									1
		payEntity.setPayrefUnit("00000000");//付款公司							1
		payEntity.setPayerName("");//付款账户名									2
		payEntity.setPayerBankAccount("");//付款账户								2
		payEntity.setPayerBankCode("");//付款账户银行代码						2
		payEntity.setPayerBankName("");//付款账户银行名称						2
		payEntity.setPayeeName("高祺");//收款账户名								1
		payEntity.setPayeeBankAccount("6227000208510185012");//收款人账号		1
		payEntity.setPayeeBankCode("");//收款人开户行代码						2
		payEntity.setPayeeBankName("中国建设银行");//收款人开户行					1
		payEntity.setPayFee(0.01);//付款金额										1
		payEntity.setCurrency("CNY");//币别										1 默认CNY
		payEntity.setUse("高祺22222测试银企接口");//用途						1报销人+报销单号+详细描述
		payEntity.setOperateDate(date);//交易日期	
		
		queryEntity = client.payForm(payEntity);
		System.out.println("payForm.entitys:" + queryEntity.getReturnMsg().getValue());
		System.out.println("payForm.status:" + queryEntity.getPayStatus().getValue());
	}
	
	public static void testQuery(){
		BigPayEntity entity = new BigPayEntity(); 
		entity.setCertiId(certiId);//业务ID 								1
		entity.setCertiNo("2222229");//业务号									1
		entity.setClaimNo("222222");//CAS的赔案号	
		queryEntity = client.query(entity);
		System.out.println("query.entitys:" + queryEntity.getReturnMsg().getValue());
	}
	
	/**
	 * entity.setCertiId(gelog.getRequestno());
	 * entity.setRequestNo(gelog.getPaymentno());
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		//testPayForm();
		testQuery();
	}
}
