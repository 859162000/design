package com.sinosoft.libertyoa.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.sinosoft.libertyoa.dao.ContractApproveMapper;
import com.sinosoft.libertyoa.entity.ContractApprove;

@Service
public class ContractApproveService {

	@Resource
	public ContractApproveMapper contractApproveMapper;
	
	/**
	 * 将数据库中找到的数据并以map的形式返回
	 * @return
	 */
	public Map<String, Object> findContractApprove(String contractId){
		ContractApprove contractApprove = contractApproveMapper.findById(contractId);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("contractApprove", contractApprove);
		return map;
	}
}
