package com.coco.test;

import org.hibernate.SessionFactory;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.coco.entity.User;
import com.coco.entity.UserDAO;

public class TestCase {
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	@Test
	public void test() {
		SessionFactory sessionFactory = ctx.getBean(SessionFactory.class);
		System.out.println("sessionFactory:" + sessionFactory);
	}

	@Test
	public void testDao() {
		UserDAO userDao = ctx.getBean(UserDAO.class);
		System.out.println("userDao:" + userDao);
		User user = userDao.findById("liubei");
		System.out.println("user password:" + user.getPassword());
	}
}
