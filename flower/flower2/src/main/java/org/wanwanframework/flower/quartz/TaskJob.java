package org.wanwanframework.flower.quartz;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 定时器
 * @author Administrator
 *
 */
@Component  
public class TaskJob {
	
	@Scheduled(cron = "0/5 * * * * ?") 
	public void job1() {  
		System.out.println("task job    vvvv");  
	}  
}