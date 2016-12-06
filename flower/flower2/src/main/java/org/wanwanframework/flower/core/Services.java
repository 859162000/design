package org.wanwanframework.flower.core;

import org.springframework.beans.factory.annotation.Autowired;

public class Services<T> {

	@Autowired
	protected Dao<T> dao;

	public Dao<T> getDao() {
		return dao;
	}

	public void setDao(Dao<T> dao) {
		this.dao = dao;
	}
}
