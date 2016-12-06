package org.wanwan.test.plugin.jpa;
 
import org.hibernate.SessionFactory;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.wanwan.flower.login.controller.LoginAction;
 
public class TestBaseCase {
	 
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	//@Test
	public void test() {
		//org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean bean;
		SessionFactory sessionFactory = ctx.getBean(SessionFactory.class);
		System.out.println("sessionFactory:" + sessionFactory);
	}

	@Test
	public void testDao() { 
		//LoginDao dao = ctx.getBean(LoginDao.class);
		//System.out.println("user:" + dao.findByCode("admin"));
		//System.out.println("user:" + dao.findByDeptId(1000));
	}
	
	//@Test
	public void testAction() {
		LoginAction bean = ctx.getBean(LoginAction.class);
		System.out.println("userDao:" + bean);  
	}
}
