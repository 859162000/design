package org.wanwanframework.flower.core;

import java.util.Map;

import com.opensymphony.xwork2.ActionSupport;
 
public class Controllers extends ActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = -5460549624382225964L;

	protected Map<String,Object> data;

	public Map<String,Object> getData() {
		return data;
	}

	public void setData(Map<String,Object> data) {
		this.data = data;
	}
}
