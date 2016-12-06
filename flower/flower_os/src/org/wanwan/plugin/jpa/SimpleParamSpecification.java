package org.wanwan.plugin.jpa;
 
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

/**
 * 通过键值对实现多参数联合查询
 * 
 * @author lirh
 * @param <T> 要查询的实体类
 * @see Specifications
 */
public class SimpleParamSpecification<T> implements Specification<T> {

	private Map<String, Object> map;
	 
	/**
	 * 查询键值对里的条件
	 * 
	 * @param name
	 * @param value
	 */
	public SimpleParamSpecification(Map<String, Object> map) {
		 this.map = map;
	}
  
	private Predicate buildPredicate(Root<T> root, CriteriaBuilder cb){
		Predicate predicate = null;
		for(String key : map.keySet()){ 
			predicate = cb.equal(root.get(key).as(String.class), map.get(key));
			predicate = cb.and(predicate);
		}
		return predicate;
	}
	
	@Override
	public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		Predicate predicate = buildPredicate(root, cb);
		query.where(predicate);
		return query.getRestriction();
	}
 
}
