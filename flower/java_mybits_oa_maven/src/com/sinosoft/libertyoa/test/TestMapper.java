package com.sinosoft.libertyoa.test;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.sinosoft.libertyoa.dao.LoginMapper;
import com.sinosoft.libertyoa.entity.ContractApprove;
import com.sinosoft.libertyoa.entity.Login;
import com.sinosoft.libertyoa.web.ContractApproveController;
import com.sinosoft.libertyoa.web.LoginController;
 
public class TestMapper {
	
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	//@Test
	public void test6() {
		BasicDataSource ds = 
			ctx.getBean(BasicDataSource.class);
		System.out.println(ds);
	}
	
	public static void main(String[] args) {
		TestMapper mapper = new TestMapper();
		mapper.test6();
	}
	 
	//@Test
	public void testMapper(){
		LoginMapper mapper = ctx.getBean(LoginMapper.class);
		Login login = new Login(); 
		login.setUsername("hello");
		login.setPassword("...");
		mapper.save(login);
		
	}
	
	//@Test
	public void testController(){
		LoginController controller = ctx.getBean(LoginController.class);
		System.out.println("controller:" + controller);
	}
	
	/**
	 * 测试合同审批插入数据库的
	 */
	//@Test
	public void testContractApprove(){
		ContractApproveController controller = ctx.getBean(ContractApproveController.class);
		System.out.println("controller:" + controller);
		ContractApprove contractApprove = new ContractApprove();
		contractApprove.setContract_id("HT10009");
		contractApprove.setContract_type("aa"); 
		contractApprove.setContract_class("1");
		contractApprove.setContract_stage("rr");
		controller.contractApproveService.contractApproveMapper.save(contractApprove);
	}
	
	@Test
	public void testFindContractApprove(){
		ContractApproveController controller = ctx.getBean(ContractApproveController.class);
		ContractApprove obj = controller.contractApproveService.contractApproveMapper.findById("HT10009");
		System.out.println("contractApprove:" + obj);
	}
}
