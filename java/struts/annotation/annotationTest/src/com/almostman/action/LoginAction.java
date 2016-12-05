package com.almostman.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
@ParentPackage("struts-default") 
public class LoginAction extends ActionSupport{

	private String username;
	private String password;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
 
	@Action(value="loginin",
			results=
				{
					@Result(name="success", location="/success.jsp"),
					@Result(name="input", location="/error.jsp")
				}
			)
	public String loginin() throws Exception {
		
		if("admin".equals(username) && "admin".equals(password)){
			return SUCCESS;
		} 
		return INPUT;
	}

}
