package com.sinosoft.libertyoa.dao;

import com.sinosoft.libertyoa.entity.Login;
 
@Repositoryable
public interface LoginMapper {
 
	Login findByName(String userName);
	 
	void save(Login user);
 
	void update(Login user);
	
}
