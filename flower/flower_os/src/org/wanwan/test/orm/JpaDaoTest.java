package org.wanwan.test.orm;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;

import org.junit.Test;
import org.wanwan.flower.orm.jpa.JpaDao;
import org.wanwan.plugin.utils.Log;
import org.wanwan.test.AppTest;

public class JpaDaoTest extends AppTest{

	@Resource
	JpaDao jpaDao;
	
	@Test
	public void testDao(){
		String sql = "select * from l_account";
		List<?> list = jpaDao.query(sql);
		Log.log("list:" + list);
	}
	
	@Test
	public void testEntityManager(){
		EntityManager entitymanager = jpaDao.getEntityManager();
		System.out.println("em:" + entitymanager.getEntityManagerFactory());
	}
}
