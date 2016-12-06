package org.wanwan.test.task;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.wanwan.flower.quartz.TaskJob;
import org.wanwan.plugin.utils.Log;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })
public class TaskTest {

	@Autowired
	TaskJob taskJob;
	
	@Test
	public void testTask(){
		taskJob.job1();
		Log.log("vvvv...");
	}
}
