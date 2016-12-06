package org.wanwan.plugin.jpa.sql;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class JpaSql {

	@Resource
	private EntityManagerFactory emf;
	
	private EntityManager em = emf.createEntityManager();
	
	public List<?> query(String sql){
		List<?> list = em.createNativeQuery(sql).getResultList();
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
		List<?> list = em.createNativeQuery(sql, classs.getClass()).getResultList();
		return list;
	}
}
