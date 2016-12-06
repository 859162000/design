package com.sinosoft.libertyoa.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.sinosoft.libertyoa.dao.LoginMapper;
import com.sinosoft.libertyoa.entity.Login;
 
@Service
public class LoginService {

	@Resource
	private LoginMapper loginMapper;
	
	/**
	 * 检查是否有用户
	 * @param userName
	 * @param password
	 * @return
	 */
	public Map<String, Object> checkUser(String userName, String password){
		Map<String, Object> map = null;
		if(userName != null && password != null){
			Login login = loginMapper.findByName(userName);
			if(login != null){
				String pass = login.getPassword();
				if(pass != null && pass.equals(password)){
					//校验成功
					map = new HashMap<String, Object>();
					map.put("flag", "success");
					map.put("user", login); 
				}	
			}
		}
		return map;
	}
}
