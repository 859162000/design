package org.wanwan.plugin.jpa;

public class UionQImpl implements UionQ{

	private String sql = " ";

	public static void main(String[] args) {
		UionQImpl impl = new UionQImpl();
		String sql = impl.select(impl.field("cc").field("uu")).
				from(impl.field("T_USER")).where(impl.field("cc").equal("bb")).toSql();  
		System.out.println(sql);
	}
	
	@Override
	public UionQ select(UionQ sub) {
		sql = SqlEnum.select + " " + sub.toSql();
		return this;
	}

	@Override
	public UionQ from(UionQ sub) {
		sql = SqlEnum.from  + " " + sub.toSql();
		return this;
	}

	@Override
	public UionQ where(UionQ sub) {
		sql = SqlEnum.where  + " " + sub.toSql();
		return this;
	}

	@Override
	public UionQ join(UionQ sub) {
		sql = SqlEnum.join  + " " + sub.toSql();
		return this;
	}

	@Override
	public UionQ have(UionQ sub) {
		sql = SqlEnum.have + " "  + sub.toSql();
		return this;
	}

	@Override
	public String toSql() {
		
		return sql;
	}
	  
	@Override
	public UionQ field(String field) {
		sql = " " + field + sql;
		return this;
	}

	@Override
	public UionQ and(UionQ sub) {
		sql = SqlEnum.have + " "  + sub.toSql();
		return this;
	}
 
	@Override
	public UionQ equal(String value) {
		sql = " = " + value + sql;
		return this;
	}
}
