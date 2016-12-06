package org.wanwan.plugin.jpa;

/**
 * 简单查询封装接口
 * 
 * @author coco
 *
 */
public interface Sql {
	 
	public Sql where(String express);
	
	public Sql equal(String express);
	
	public Sql like(String express);
	
	public Sql order(String express);
	
	public Sql between(String express);
	
	public Sql and(String express);
	
	public Sql or(String express);
}
