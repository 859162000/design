package org.wanwanframework.flower.core;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface Dao<T> extends PagingAndSortingRepository<T, Integer> {

}
