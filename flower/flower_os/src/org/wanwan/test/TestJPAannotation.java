package org.wanwan.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })

/**
 * 暂时不用这个，因为这个测试要用到：spring4.2
 * @author Administrator
 *
 */
public class TestJPAannotation {

	@Autowired
	//private LoginDao dao;
	
	@Test
	public void testDaoMethods() {
		//System.out.println(dao);
		//System.out.println("user:" + dao.findByName("管理员"));  
	}
	
}
