package org.wanwan.flower.mail.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.wanwan.flower.mail.model.Account;
import org.wanwan.flower.mail.model.Mail;

/**
 * Title: 使用javamail发送邮件
 * Description: 演示如何使用javamail包发送电子邮件。这个实例可发送多附件
 * @version 1.0
 */
public class MailSendService {
  
	private List<String> file = new ArrayList<String>();// 附件文件集合

	/**
	 * <br>
	 * 方法说明：默认构造器 <br>
	 * 输入参数： <br>
	 * 返回类型：
	 */
	public MailSendService() {
		
	}
  
	/**
	 * <br>
	 * 方法说明：把主题转换为中文 <br>
	 * 输入参数：String strText <br>
	 * 返回类型：
	 */
	public static String transferChinese(String strText) {
		try {
			strText = MimeUtility.encodeText(new String(strText.getBytes(), "GB2312"), "GB2312", "B");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return strText;
	}

	/**
	 * <br>
	 * 方法说明：往附件组合中添加附件 <br>
	 * 输入参数： <br>
	 * 返回类型：
	 */
	public void attachfile(String fname) {
		file.add(fname);
	}

	/**
	 * <br>
	 * 方法说明：发送邮件 <br>
	 * 输入参数： <br>
	 * 返回类型：boolean 成功为true，反之为false
	 */
	public boolean sendMail(Account user, String host, Mail mailEntity) {
		// 构造mail session
		Properties props = System.getProperties();
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.auth", "true");
		final String usernamez = user.getUsername();
		final String passwordz = user.getPassword();
		Session session = Session.getDefaultInstance(props,
				new Authenticator() {
					public PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(usernamez, passwordz);
					}
				});

		try {
			MimeMessage msg = new MimeMessage(session);//构造MimeMessage 并设定基本的值
			msg.setFrom(new InternetAddress(mailEntity.getFrom()));
			InternetAddress[] address = { new InternetAddress(mailEntity.getTo()) };
			msg.setRecipients(Message.RecipientType.TO, address);
			msg.setSubject(transferChinese(mailEntity.getSubject()));
			msg.setContent(createMultipart(mailEntity.getContent()));//向Multipart添加MimeMessage
			msg.setSentDate(new Date());
			Transport.send(msg);// 发送邮件
		} catch (MessagingException mex) {
			mex.printStackTrace();
			Exception ex = null;
			if ((ex = mex.getNextException()) != null) {
				ex.printStackTrace();
			}
			System.out.println("" + mex.getMessage());
			return false;
		}
		return true;
	}

	private Multipart createMultipart(String content) throws MessagingException {
		// 构造Multipart
		Multipart multipart = new MimeMultipart();
		// 向Multipart添加正文
		MimeBodyPart mbpContent = new MimeBodyPart();
		mbpContent.setText(content);
		// 向MimeMessage添加（Multipart代表正文）
		multipart.addBodyPart(mbpContent);
		// 向Multipart添加附件
		Iterator<String> efile = file.iterator();
		while (efile.hasNext()) {
			MimeBodyPart mbpFile = new MimeBodyPart();
			FileDataSource fds = new FileDataSource(efile.next().toString());
			mbpFile.setDataHandler(new DataHandler(fds));
			mbpFile.setFileName(fds.getName());
			// 向MimeMessage添加（Multipart代表附件）
			multipart.addBodyPart(mbpFile);
		}
		file.removeAll(file);
		return multipart;
	}
  
	public List<String> getFile() {
		return file;
	}

	public void setFile(List<String> file) {
		this.file = file;
	}
  
	public static void main(String[] args) {
		MailSendService service = new MailSendService();
		Account user = new Account();
		System.out.println("begin...");
		user.setUsername("lironghai_1988@163.com");//主机邮箱用户名
		user.setPassword("chengzhi233");//主机邮箱密码
		Mail mail = new Mail();
		mail.setFrom("lironghai_1988@163.com");
		mail.setTo("632468635@qq.com");
		mail.setContent("this, welcome thank you!" + Math.random());
		mail.setSubject("this" + Math.random());
		service.attachfile("E:\\quick\\english.zip"); 
		service.sendMail(user, "smtp.163.com", mail);
		System.out.println("end...");
	}
}