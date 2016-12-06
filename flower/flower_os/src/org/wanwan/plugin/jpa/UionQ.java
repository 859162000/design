package org.wanwan.plugin.jpa;

public interface UionQ {

	public UionQ select(UionQ sub);
	
	public UionQ from(UionQ sub);
	
	public UionQ where(UionQ sub);
	
	public UionQ join(UionQ sub);
	
	public UionQ have(UionQ sub);
	
	public UionQ field(String field);
	
	public UionQ and(UionQ sub);
	
	public UionQ equal(String value);
	
	public String toSql();
	
}
