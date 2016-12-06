package org.wanwan.plugin.jpa;

public class SqlImpl implements Sql{

	@Override
	public Sql where(String field) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public Sql equal(String value) { 
		// TODO Auto-generated method stub
		return null;
	}
 
	@Override
	public Sql and(String field) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Sql or(String field) {
		// TODO Auto-generated method stub
		return null;
	}
 
	@Override
	public Sql like(String value) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Sql order(String field) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public Sql between(String field) {
		// TODO Auto-generated method stub
		return null;
	}
	 
	public void test(){
		this.where("code").equal("admin").and("name").equal("管理员");
		this.where("value").between("5").and("10");
	}

}
