package org.wanwan.test.plugin.jpa;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.wanwan.flower.orm.jpa.JpaService;
import org.wanwan.test.AppTest;

public class JpaSqlTest extends AppTest{

	@Resource
	private JpaService service;
	
	@Test
	public void testFactory(){
		System.out.println(service);
	}
	
	@Test
	public void testQuery(){
		List<?> list = service.query("select * from t_dept");
		System.out.println(list);
	}
}
