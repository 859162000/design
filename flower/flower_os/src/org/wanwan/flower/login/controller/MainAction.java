package org.wanwan.flower.login.controller;

import java.util.HashMap;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.wanwan.flower.core.Controllers;

@Controller("mainAction")
@Scope("prototype")
public class MainAction extends Controllers{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
 
	public String main(){
		System.out.println("main...");
		return SUCCESS;
	}
	
	public String query(){
	    data = new HashMap<String, Object>();  
        //User user = new User();  
        //user.setName("张三");  
        //user.setPassword("123");  
        //dataMap.put("user", user);  
        // 放入一个是否操作成功的标识  
        data.put("authors", "coco"); 
        data.put("success", true); 
		System.out.println("query...");
		return SUCCESS;
	}
 
}
