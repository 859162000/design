package com.ssh.test;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.ssh.user.dao.impl.UserDaoImpl;

public class TestCase {
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	@Test
	public void testDao(){
		UserDaoImpl dao = ctx.getBean("userDao", UserDaoImpl.class);
		System.out.println("dao:" + dao);
	}
}
