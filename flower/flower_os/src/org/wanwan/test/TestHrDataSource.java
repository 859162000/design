package org.wanwan.test;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
 
public class TestHrDataSource {
	
	@Autowired
	//private LoginDao dao;
	
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	@Test
	public void testDataSource(){
		BasicDataSource BasicDataSource = ctx.getBean("hrDataSource", BasicDataSource.class);
		System.out.println(BasicDataSource);
	}
}
