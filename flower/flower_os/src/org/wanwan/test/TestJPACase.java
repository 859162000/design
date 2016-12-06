package org.wanwan.test;
 
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
//import org.wanwan.flower.login.dao.LoginDao;
 
public class TestJPACase {
	private ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
					"applicationContext.xml");
	//@Test
	public void testEntityFactory() {
		//org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean bean;
		Object entityManagerFactory = ctx.getBean("entityManagerFactory");
		System.out.println("entityManagerFactory:" + entityManagerFactory);
	}
	
	//@Test
	public void testIUserDao() {
		//org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean bean;
		//LoginDao dao = ctx.getBean(LoginDao.class);
		//System.out.println("userDao:" + dao);
	}
	
	//@Test
	public void testDaoMethod() {
		//org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean bean;
		//LoginDao dao = ctx.getBean(LoginDao.class);
		//System.out.println("userDao:" + dao.findAll());
	}
	
	@Test
	public void testDaoMethods() {
		//org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean bean;
		//LoginDao dao = ctx.getBean(LoginDao.class);
		//System.out.println("user:" + dao.findByName("管理员"));  
	}
	 
}
