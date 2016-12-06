package org.wanwanframework.flower.remburse.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionSupport;

@Controller("remburseAction")
@Scope("prototype")
@SuppressWarnings("serial")
public class RemburseAction extends ActionSupport{
	
	private Map<String,Object> dataMap; 
	 
	public String query(){
		  // dataMap中的数据将会被Struts2转换成JSON字符串，所以这里要先清空其中的数据  
        dataMap = new HashMap<String, Object>();  
        //User user = new User();  
        //user.setName("张三");  
        //user.setPassword("123");  
        //dataMap.put("user", user);  
        // 放入一个是否操作成功的标识  
        dataMap.put("authors", "coco"); 
        dataMap.put("success", true);  
        // 返回结果  
        return SUCCESS; 
	}
	
	public Map<String, Object> getDataMap() {  
        return dataMap;  
    } 
 
}
