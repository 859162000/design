package org.wanwanframework.flower.mail.model;

import java.io.Serializable;

public class Mail implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String subject;
	private String content;
	private String from;
	private String to;
	
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
}
