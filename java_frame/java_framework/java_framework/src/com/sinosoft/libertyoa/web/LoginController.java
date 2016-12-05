package com.sinosoft.libertyoa.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sinosoft.libertyoa.entity.Result;
import com.sinosoft.libertyoa.service.LoginService;
 
/**
 * 
 * @author 登陆模块
 *
 */
@Controller
@RequestMapping("/login")
public class LoginController {

	@Resource
	private LoginService loginService;
	
	/**
	 * 登录验证
	 * @return
	 */  
	@RequestMapping("/login.do")
	@ResponseBody
	public Result login(String userName, String password){
		Map<String, Object> m = new HashMap<String, Object>();
		Result result = new Result();
		if(userName != null && password != null){
			result.setSuccess(true);
			m.put("userId", userName);
			m.put("userName", password); 
			m = loginService.checkUser(userName, password);
			result.setData(m);
		}else{
			result.setSuccess(false);
		}
		System.out.println("userName:" + userName + "  p:" + password);
		return result;
	}
}
