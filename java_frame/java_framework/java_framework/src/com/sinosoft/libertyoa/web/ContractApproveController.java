package com.sinosoft.libertyoa.web;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sinosoft.libertyoa.entity.Result;
import com.sinosoft.libertyoa.service.ContractApproveService;

/**
 * 合同审批模块
 * @author lirh
 *
 */
@Controller
@RequestMapping("/main")
public class ContractApproveController {

	@Resource
	public ContractApproveService contractApproveService;
	
	/**
	 * 合同审批查询
	 * @return
	 */
	@RequestMapping("/contract.do")
	@ResponseBody
	public Result contractApprove(String contractId){
		System.out.println("contarctId:" + contractId);
		Result result = null;
		if(contractId != null){
			Map<String, Object> map = contractApproveService.findContractApprove(contractId);
			result = new Result(map); 
		}
		System.out.println("map:" + result);
		return result;
	}
	
	/**
	 * 合同审批增加
	 * @return
	 */
	@RequestMapping("/contractAdd.do")
	@ResponseBody
	public Result contractApproveAdd(Object object){
		Result result = null;
		System.out.println("object:" + object);
		return result;
	}
}
