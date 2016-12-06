(function() {
var PermissionLv = {
	/** 0.没有权限,如果用户的权限等级小于等于MIN，则表示没有任何权限 */
	MIN : {
		lv: 0,
		text: 'app.permission.min'
	},

	/** 1.仅能操作自己的数据 */
	SELF: {
		lv: 1,
		text: 'app.permission.self'
	},

	/** 2.可操作子部门的数据 */
	DEPT_CHILDREN: {
		lv: 0x2,
		text: 'app.permission.dept.children'
	},
	/** 4.可操作本部门的数据 */
	DEPT: {
		lv: 0x4,
		text: 'app.permission.dept'
	},

	/** 8.可操作子公司数据 */
	COMPANY_CHILDREN : {
		lv: 0x8,
		text: 'app.permission.company.children'
	},

	/** 16.可操作本公司数据 */
	COMPANY: {
		lv: 0x10,
		text: 'app.permission.company'
	},

	/** 65536.最大权限，可操作所有数据.如果用户配置的权限等级大于等于MAX，则表示可以操作所有数据 */
	MAX: {
		lv: 0x10000,
		text: 'app.permission.max'
	}
};

define("PermissionLv", [], PermissionLv);

})();
