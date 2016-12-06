package com.wanwan.ai.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.wanwan.ai.core.ChessEntity;
import com.wanwan.ai.dao.EntityMapper;
@Service
public class EntityService {
	@Resource
	private EntityMapper entityMapper;
	public List<ChessEntity> find(){
		String id = "2";
		List<ChessEntity> list = entityMapper.finds("4");
		return list;
	}
	 
}
