package com.sinosoft.payment.webservice.read;

import java.util.Date;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import com.sinosoft.payment.webservice.model.BigPayEntity;
import com.sinosoft.payment.webservice.read.service.PayReadService;

/**
 * 调用webservice的客户端
 * 
 * @author
 *
 */
public class PayReadClient {

	public static String address = "http://192.168.0.210:8080/ems/webservice/readPaymentStatus";
	
	JaxWsProxyFactoryBean svr = new JaxWsProxyFactoryBean();

	public PayReadClient() {
		svr.setServiceClass(PayReadService.class);
		svr.setAddress(address);
	}

	public void payRead() {
		PayReadService service = (PayReadService) svr.create();
		BigPayEntity entity = new BigPayEntity(); 
		
		entity.setCertiId("vvvvvvvv");	
		entity.setCertiNo("222222");//业务号									1
		entity.setClaimNo("222222");//CAS的赔案号								1
		entity.setPolicyNo("222222");//保单号									1
		entity.setPayrefUnit("0");//付款公司							1
		entity.setPayerName("");//付款账户名									2
		entity.setPayerBankAccount("");//付款账户								2
		entity.setPayerBankCode("");//付款账户银行代码						2
		entity.setPayerBankName("");//付款账户银行名称						2
		entity.setPayeeName("高祺ss");//收款账户名								1
		entity.setPayeeBankAccount("0");//收款人账号		1
		entity.setPayeeBankCode("");//收款人开户行代码						2
		entity.setPayeeBankName("建设银行");//收款人开户行					1
		entity.setPayFee(100.0);//付款金额										1
		entity.setCurrency("CNY");//币别										1 默认CNY
		entity.setUse("高祺22222测试银企接口");//用途						1报销人+报销单号+详细描述
		entity.setOperateDate(new Date());//交易日期	
		
		service.payRead(entity);
	}
	
	public static void main(String[] args) {
		PayReadClient client = new PayReadClient();
		client.payRead(); 
	}
}
