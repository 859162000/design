package org.wanwanframework.flower.jms;

import java.io.Serializable;

public class EmailBean implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String subject;
	private String content;
	private String desAddr;
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
	public String getDesAddr() {
		return desAddr;
	}
	public void setDesAddr(String desAddr) {
		this.desAddr = desAddr;
	}
}
