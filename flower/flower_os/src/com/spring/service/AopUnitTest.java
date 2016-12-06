package com.spring.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:aop.xml" })
public class AopUnitTest {

	@Autowired
    private AServiceImpl aService;  
    
	@Autowired
    private BServiceImpl bService;
	
	/**
	 * 测试正常调用  
	 */
	@Test
    public void testCall()  
    {    
        aService.fooA("JUnit test fooA");  
        aService.barA();  
        bService.fooB();  
        bService.barB("JUnit test barB",0);  
    } 
}
