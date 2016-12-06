<%@ page language="java" contentType="application/json; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%-- struts2错误信息页面 --%>
<%
	response.setStatus(500);	// 视为出现500错误
	response.setHeader("Pragma","No-cache"); 
	response.setHeader("Cache-Control","no-cache"); 
	response.setDateHeader("Expires", 0); 
%>
{
	"error": true,
	"exception": "<s:property value="exception" escapeHtml="false" escapeJavaScript="true" />",
	"actionErrors": <s:property value="objectMapper.writeValueAsString(actionErrors)" escapeHtml="false" />,
	"fieldErrors": <s:property value="objectMapper.writeValueAsString(fieldErrors)" escapeHtml="false" />,
	"actionMessage": <s:property value="objectMapper.writeValueAsString(actionMessage)" escapeHtml="false" />
}