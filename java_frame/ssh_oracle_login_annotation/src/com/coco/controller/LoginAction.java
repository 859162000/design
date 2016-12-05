package com.coco.controller;

import com.coco.entity.User;
import com.coco.entity.UserDAO;
import com.opensymphony.xwork2.Action;

/**
 * @author  yeeku.H.lee kongyeeku@163.com
 * @version  1.0
 * <br>Copyright (C), 2005-2008, yeeku.H.Lee
 * <br>This program is protected by copyright laws.
 * <br>Program Name:
 * <br>Date: 
 */

public class LoginAction implements Action
{
	private String username;
	private String password;
	private String tip;
	
	private UserDAO userDAO;
	 
	public void setUsername(String username)
	{
		this.username = username;
	}
	public String getUsername()
	{
		 return this.username;
	}

	public void setPassword(String password)
	{
		this.password = password;
	}
	public String getPassword()
	{
		 return this.password;
	}

	public void setTip(String tip)
	{
		this.tip = tip;
	}
	public String getTip()
	{
		 return this.tip;
	}
  
    public String execute() throws Exception
	{ 
		// String sourceName = "liubei";
		// String sourcePassword = "123";
		User user = userDAO.findById(username);
		if (user != null) {

			boolean isSuccess = user.getUsername().equals(username) && user.getPassword().equals(password);

			if (isSuccess) {
				setTip("哈哈，整合成功！");
				System.out.print("isSuccess:" + isSuccess);
				return SUCCESS;
			} else {
				return ERROR;
			}
		}
		return ERROR;
	}
	public UserDAO getUserDAO() {
		return userDAO;
	}
	public void setUserDAO(UserDAO userDAO) {
		this.userDAO = userDAO;
	}
 
}