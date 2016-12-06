package org.wanwanframework.flower.mail.service;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.jms.Message;
import javax.jms.Session;

import org.apache.activemq.transport.Transport;
import org.apache.commons.fileupload.util.mime.MimeUtility;
import org.springframework.messaging.MessagingException;
import org.wanwanframework.flower.mail.model.Account;
import org.wanwanframework.flower.mail.model.Mail;

/**
 * Title: 浣跨敤javamail鍙戦�閭欢
 * Description: 婕旂ず濡備綍浣跨敤javamail鍖呭彂閫佺數瀛愰偖浠躲�杩欎釜瀹炰緥鍙彂閫佸闄勪欢
 * @version 1.0
 */
public class MailSendService {
  
	private List<String> file = new ArrayList<String>();// 闄勪欢鏂囦欢闆嗗悎

	/**
	 * <br>
	 * 鏂规硶璇存槑锛氶粯璁ゆ瀯閫犲櫒 <br>
	 * 杈撳叆鍙傛暟锛�<br>
	 * 杩斿洖绫诲瀷锛�
	 */
	public MailSendService() {
		
	}
  
	/**
	 * <br>
	 * 鏂规硶璇存槑锛氭妸涓婚杞崲涓轰腑鏂�<br>
	 * 杈撳叆鍙傛暟锛歋tring strText <br>
	 * 杩斿洖绫诲瀷锛�
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
	 * 鏂规硶璇存槑锛氬線闄勪欢缁勫悎涓坊鍔犻檮浠�<br>
	 * 杈撳叆鍙傛暟锛�<br>
	 * 杩斿洖绫诲瀷锛�
	 */
	public void attachfile(String fname) {
		file.add(fname);
	}

	/**
	 * <br>
	 * 鏂规硶璇存槑锛氬彂閫侀偖浠�<br>
	 * 杈撳叆鍙傛暟锛�<br>
	 * 杩斿洖绫诲瀷锛歜oolean 鎴愬姛涓簍rue锛屽弽涔嬩负false
	 */
	public boolean sendMail(Account user, String host, Mail mailEntity) {
		// 鏋勯�mail session
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
			MimeMessage msg = new MimeMessage(session);//鏋勯�MimeMessage 骞惰瀹氬熀鏈殑鍊�
			msg.setFrom(new InternetAddress(mailEntity.getFrom()));
			InternetAddress[] address = { new InternetAddress(mailEntity.getTo()) };
			msg.setRecipients(Message.RecipientType.TO, address);
			msg.setSubject(transferChinese(mailEntity.getSubject()));
			msg.setContent(createMultipart(mailEntity.getContent()));//鍚慚ultipart娣诲姞MimeMessage
			msg.setSentDate(new Date());
			Transport.send(msg);// 鍙戦�閭欢
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
		// 鏋勯�Multipart
		Multipart multipart = new MimeMultipart();
		// 鍚慚ultipart娣诲姞姝ｆ枃
		MimeBodyPart mbpContent = new MimeBodyPart();
		mbpContent.setText(content);
		// 鍚慚imeMessage娣诲姞锛圡ultipart浠ｈ〃姝ｆ枃锛�
		multipart.addBodyPart(mbpContent);
		// 鍚慚ultipart娣诲姞闄勪欢
		Iterator<String> efile = file.iterator();
		while (efile.hasNext()) {
			MimeBodyPart mbpFile = new MimeBodyPart();
			FileDataSource fds = new FileDataSource(efile.next().toString());
			mbpFile.setDataHandler(new DataHandler(fds));
			mbpFile.setFileName(fds.getName());
			// 鍚慚imeMessage娣诲姞锛圡ultipart浠ｈ〃闄勪欢锛�
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
		user.setUsername("lironghai_1988@163.com");//涓绘満閭鐢ㄦ埛鍚�
		user.setPassword("chengzhi233");//涓绘満閭瀵嗙爜
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