package org.wanwanframework.flower.jdbc.model;

public interface SqlEntity {

	public static final String update = "1";

	public static final String insert = "0";

	public String toInsert();

	public String toName();

	public String toUpdate();
	
	/**
	 * 鏍规嵁type鑷姩澶勭悊sql璇彞鏄痠nsert杩樻槸update
	 * 
	 * @return
	 */
	public String toSql();

	/**
	 * 鑾峰彇鏈疄浣撶殑id
	 * 
	 * @return
	 */
	public int getId();
	
	/**
	 * 鑾峰彇鏈疄浣撶殑code锛屽湪鏁版嵁搴撲腑鏄敮涓�殑瀛楁
	 * 
	 * @return
	 */
	public String getCode();

	public String getType();

	public void setType(String type);

}
