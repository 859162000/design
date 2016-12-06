/** 常量 */
(function() {
	"use strict"; // 审核时可能用到的一些静态常量

	/** 0.暂存 */
	var STATUS_SAVE = "0";
	/** 1.提交,待审批.如果有任意审批人审批后,变为2.审批中 */
	var STATUS_SUBMIT = "1";
	/** 2.审批中 */
	var STATUS_APPROVING = "2";
	/** A. 审批完成 */
	var STATUS_APPRVOED = "A";
	/** B.审批完成,待费用单据签收 */
	var STATUS_RECEIPT = "B";
	/** C.已签收,待费用单据审核(会计制单) */
	var STATUS_ACCOUNTING = "C";
	/** P.待支付 */
	var STATUS_PAYING = "P";
	/** Z.完成/已支付 */
	var STATUS_CLOSED = "Z";
	/** E.预支后已完成归还 */
	var STATUS_RETURNED = "E";
	/** R.审批退回,退回后的数据不能保存,只能提交 */
	var STATUS_REJECTION = "R";
	/** RP.支付退回,退回后仅可修改收款人信息 */
	var STATUS_REJECTION_PAY = "RP";
	
	/** start 预算调整 */
	/** 部门内调整 */
	var adjustType_inside = "inside";
	/** 本部门调出 */
	var adjustType_callout = "callout";
	/** 其它部门调入 */
	var adjustType_callin = "callin";
	/** end 预算调整  */
	
	var Constants = {
		STATUS : {	// 申请单状态
			/** 0.暂存 */
			SAVE : STATUS_SAVE,
			/** 1.提交,待审批.如果有任意审批人审批后,变为A.审批中 */
			SUBMIT : STATUS_SUBMIT,
			/** 2.审批中 */
			APPROVING : STATUS_APPROVING,
			/** A.审批完成 */
			APPRVOED : STATUS_APPRVOED,
			/** B.审批完成,待费用单据签收 */
			RECEIPT : STATUS_RECEIPT,
			/** C.已签收,待费用单据审核(会计制单) */
			ACCOUNTING : STATUS_ACCOUNTING,
			/** P.待支付 */
			PAYING : STATUS_PAYING,
			/** Z.完成/已支付 */
			CLOSED : STATUS_CLOSED,
			/** E.预支后已完成归还 */
			RETURNED : STATUS_RETURNED,
			/** R.审批退回 */
			REJECTION : STATUS_REJECTION,
			/** RP.支付退回,退回后仅可修改收款人信息 */
			REJECTION_PAY : STATUS_REJECTION_PAY,
			adjustType_inside : adjustType_inside,
			adjustType_callout : adjustType_callout,
			adjustType_callin : adjustType_callin
		}
	};

	define("Constants", [], function() {
		return Constants;
	});
})();