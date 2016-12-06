package com.sinosoft.libertyoa.dao;

import com.sinosoft.libertyoa.entity.ContractApprove;

@Repositoryable
public interface ContractApproveMapper {
	
	ContractApprove findById(String contractId);
	 
	void save(ContractApprove contractApprove);
 
	void update(ContractApprove contractApprove);
}
