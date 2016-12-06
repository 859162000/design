<%@ page language="java" contentType="application/javascript; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	response.setHeader("Pragma","No-cache"); 
	response.setHeader("Cache-Control","no-cache"); 
	response.setDateHeader("Expires", 0); 
%>
<%-- 网站根目录 --%>
var CONTEXT_PATH = "<%=request.getContextPath()%>";
<%-- 当前使用的语言 --%>
var LOCALE = "<s:property value="locale" escapeHtml="false" escapeJavaScript="true" />";
<%-- 默认的每页数量 --%>
var DEFAULT_PAGE_SIZE = <s:property value="@com.sinosoft.util.SystemUtils@DEFAULT_PAGE_SIZE" />;
<%-- 当前的会计期间 --%>
var CURRENT_MONTH = <s:if test="currentMonth == null">null</s:if><s:else><s:property value="currentMonth.serialize()" escapeHtml="false" /></s:else>;
<%-- 当前的本位币 --%>
var CURRENCY = <s:property value="standardCurrency.serialize()" escapeHtml="false" />;
<%-- eFling上传参数 --%>
var UPLOADER = <s:if test="uploader == null">null</s:if><s:else><s:property value="uploader" escapeHtml="false" /></s:else>;
<%-- 可上传的附件类型 --%>
var ACCEPT_FILE_SUFFIX = "<s:property value="@com.sinosoft.ems.uploader.FileUploadAction@ACCEPT_FILE_SUFFIX" escapeHtml="false" escapeJavaScript="true" />";
<%-- rsa密钥 --%>
var PUBLIC_KEY = "<s:property value="rsa.publicKeyString" escapeHtml="false" escapeJavaScript="true" />";
<%-- 静态参数 --%>
var STATIC_SETTING = <s:if test="staticSetting == null">null</s:if><s:else><s:property value="@com.sinosoft.util.JsonEntity@serializer.serialize(staticSetting)" escapeHtml="false" /></s:else>;
<s:if test="json != null">
<%-- 输出当前登录用户的session信息  --%>
var CURRENT_USER = <s:property value="json.serialize()" escapeHtml="false" />;
</s:if>