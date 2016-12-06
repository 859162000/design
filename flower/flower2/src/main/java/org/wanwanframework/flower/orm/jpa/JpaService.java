package org.wanwanframework.flower.orm.jpa;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

@Service
public class JpaService {

	@Resource
	private JpaDao dao;
	
	public List<?> query(String sql){
		List<?> list = dao.getEntityManager().createNativeQuery(sql).getResultList();
		return list;
	}
	
	/**
	 * 查询结果
	 * 
	 * @param sql
	 * @param classs
	 * @return
	 */
	public List<?> query(String sql, Class<?> classs){ 
		List<?> list = dao.getEntityManager().createNativeQuery(sql, classs.getClass()).getResultList();
		return list;
	}
}
