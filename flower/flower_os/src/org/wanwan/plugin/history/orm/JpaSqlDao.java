package org.wanwan.plugin.history.orm;

import java.math.BigDecimal;
import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Service;

/**
 * 专门查询sql的jpa
 * 
 * @author
 *
 */
@Service
public class JpaSqlDao {

	@Resource
	private LocalContainerEntityManagerFactoryBean factory;

	private EntityManager em = null;

	/**
	 * 实例化em
	 * 
	 * @return
	 */
	private EntityManager getEntityManager() {
		if (em == null) {
			em = factory.getNativeEntityManagerFactory().createEntityManager();
		}
		return em;
	}
     
	/**
	 * 分页查询
	 * 
	 * @param sql
	 * @param page
	 * @param total
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Page<?> queryPage(String sql, PageRequest page, int total) {
		Query query = getEntityManager().createNativeQuery(sql); 
		return new PageImpl(query.getResultList(), page, total);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Page<?> queryPage(String sql, Object[] parameter, PageRequest page, int total) {
		Query query = getEntityManager().createNativeQuery(sql); 
		int index = 0;
		for(Object obj: parameter){
			query.setParameter(index++, obj);
		}
		return new PageImpl(query.getResultList(), page, total);
	}
	
	/**
	 * 获取报表总数
	 * 
	 * @param sql
	 * @return
	 */
	public int count(String sql) {
		BigDecimal count = (BigDecimal)getEntityManager().createNativeQuery(sql).getSingleResult();
		return count.intValue();
	}
	
	public List<?> query(String sql) {
		List<?> list = getEntityManager().createNativeQuery(sql).getResultList();
		return list;
	}

	/**
	 * 通过筛选条件查询
	 * 
	 * @param sql select o.id, o.vender as vender from OrderTable where o.id = ?1
	 * @param params
	 * @return
	 */
	public List<?> query(String sql, Object[] params) {
		Query query = getEntityManager().createNativeQuery(sql);
		int i = 1;
		for (Object obj : params) {
			query.setParameter(i++, obj);
		}
		return query.getResultList();
	}

	/**
	 * 查询结果
	 * 
	 * @param sql
	 * @param classs
	 * @return
	 */
	public List<?> query(String sql, Class<?> classs) {
		List<?> list = getEntityManager().createNativeQuery(sql, classs.getClass()).getResultList();
		return list;
	}
}
