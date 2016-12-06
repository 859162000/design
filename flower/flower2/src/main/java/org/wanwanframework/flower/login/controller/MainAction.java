package org.wanwanframework.flower.login.controller;

import java.util.HashMap;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.wanwanframework.flower.core.Controllers;

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
        //user.setName("寮犱笁");  
        //user.setPassword("123");  
        //dataMap.put("user", user);  
        // 鏀惧叆涓�釜鏄惁鎿嶄綔鎴愬姛鐨勬爣璇� 
        data.put("authors", "coco"); 
        data.put("success", true); 
		System.out.println("query...");
		return SUCCESS;
	}
 
}
