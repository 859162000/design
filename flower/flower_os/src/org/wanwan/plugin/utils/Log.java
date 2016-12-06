package org.wanwan.plugin.utils;

/**
 * 日志工具
 * @author coco
 *
 */
public class Log {

	public static final String print_head = "log::";
	
	/**
	 * 输出日志
	 * @param param
	 * @param log
	 */
	public static void log(String printHead, String param, String log){
		logString(printHead + param + ":  " +log);
	}
	
	/**
	 * 输出日志
	 * @param param
	 * @param log
	 */
	public static void log(String param, String log){
		logString(print_head + param + ":  " +log);
	}
	
	/**
	 * 输出日志
	 * @param param
	 * @param log
	 */
	public static void log(Object log){
		logString(print_head + ":  " +log);
	}
	
	/**
	 * 输出日志
	 * @param param
	 * @param log
	 */
	public static void log(String param, Object log){
		logString(print_head + param + ":  " +log);
	}
	
	public static void log(String log){
		logString(print_head + "  " + log);
	}
	
	public static void logString(String log){
		System.out.println(log);
	}
}
