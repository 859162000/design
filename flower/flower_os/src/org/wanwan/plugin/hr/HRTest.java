package org.wanwan.plugin.hr;

import org.junit.Test;

public class HRTest {
	
	@Test
	public void testMain() {
		HRServiceImpl hrService = new HRServiceImpl();
		hrService.start();
	}
	
	//@Test
	public void testDelete(){
		HRServiceImpl service = new HRServiceImpl();
		service.deleteData(); 
	}
}
