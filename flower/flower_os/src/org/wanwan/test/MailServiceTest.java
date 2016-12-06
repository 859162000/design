package org.wanwan.test;

import org.junit.Test;
import org.wanwan.flower.mail.model.Account;
import org.wanwan.flower.mail.model.Mail;
import org.wanwan.flower.mail.service.MailSendService;

public class MailServiceTest {
	
	@Test
	public void test() {
		MailSendService service = new MailSendService();
		Account user = new Account();
		user.setUsername("lironghai_1988@163.com");//主机邮箱用户名
		user.setPassword("chengzhi233");//主机邮箱密码
		Mail mail = new Mail();
		mail.setFrom("lironghai_1988@163.com");
		mail.setTo("632468635@qq.com");
		mail.setContent("this, welcome thank you!" + Math.random());
		mail.setSubject("this" + Math.random());
		service.attachfile("E:\\quick\\english.zip"); 
	}
}
