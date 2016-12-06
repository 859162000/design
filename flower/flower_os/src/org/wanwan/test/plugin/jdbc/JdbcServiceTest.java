package org.wanwan.test.plugin.jdbc;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.wanwan.flower.jdbc.controller.SystemSynchronizeService;
import org.wanwan.test.AppTest;

public class JdbcServiceTest extends AppTest{

	@Autowired
	private SystemSynchronizeService service;
 
	@Test
	public void testUpdates(){
		//service = ctx.getBean("systemSynchronizeService", SystemSynchronizeService.class);
		System.out.println("..." + service);
	}
}
