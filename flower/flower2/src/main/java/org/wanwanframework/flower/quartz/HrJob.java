package org.wanwanframework.flower.quartz;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 定时器
 * @author Administrator
 *
 */
@Component
public class HrJob {
	
	@Scheduled(cron = "0 0 12 * * ?") 
	public void job1() {  
		System.out.println("任务进行中。。。");  
	}  
}
