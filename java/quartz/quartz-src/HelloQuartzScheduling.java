package org.coco.quartz;

import java.text.ParseException;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.impl.StdSchedulerFactory;

public class HelloQuartzScheduling {

    public static void main(String[] args) 
        throws SchedulerException, ParseException {

        SchedulerFactory schedulerFactory = new StdSchedulerFactory();
        Scheduler scheduler = schedulerFactory.getScheduler();

        JobDetail jobDetail = new JobDetail("helloQuartzJob", 
                Scheduler.DEFAULT_GROUP, EJob.class);

        String cronExpression = "30/5 * * * * ?"; // 每分钟的30s起，每5s触发任务        
        CronTrigger cronTrigger = new CronTrigger("cronTrigger", 
                Scheduler.DEFAULT_GROUP, cronExpression);

        scheduler.scheduleJob(jobDetail, cronTrigger);

        scheduler.start();
    }

}