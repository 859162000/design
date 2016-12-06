package org.wanwan.flower.jms;

import java.io.Serializable;

@SuppressWarnings("serial")
public class EmailBean implements Serializable {

	private String content;
	
	private String subject;
	
	private String desAddr;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getDesAddr() {
		return desAddr;
	}

	public void setDesAddr(String desAddr) {
		this.desAddr = desAddr;
	}
}
