package org.wanwanframework.flower.login.controller;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionSupport;

@Controller("loginzAction")
@Scope("prototype")
public class LoginAction extends ActionSupport {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String username;
	private String password;
	private String tip;
 
	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return this.username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return this.password;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	public String getTip() {
		return this.tip;
	}

	public String login() throws Exception {
		if (username.length() > 0) {
			
			boolean isSuccess = true;//user.getCode().equals(username);
			if (isSuccess) {
				setTip("登陆成功");
				System.out.print("isSuccess:" + isSuccess);
				return SUCCESS;
			} else {
				return ERROR;
			}
		}
		return ERROR;
	}

}