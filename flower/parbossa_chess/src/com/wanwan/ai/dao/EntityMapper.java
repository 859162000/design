package com.wanwan.ai.dao;
 
import java.util.List;

import com.wanwan.ai.core.ChessEntity;

@PRepository
public interface EntityMapper {
  
	List<ChessEntity> finds(String id);	 
}
