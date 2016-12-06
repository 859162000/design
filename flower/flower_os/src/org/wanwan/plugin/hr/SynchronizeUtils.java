package org.wanwan.plugin.hr;

import java.util.Properties;

import org.wanwan.plugin.utils.PropertyUtil;

public class SynchronizeUtils {
 
	public static void read() {
		Properties property = PropertyUtil.loadProperty(PathConfig.synchronize_file_path);
		get(property); 
	}
	
	private static void get(Properties properties){
		 ConnectionConfig.toVo(properties); 
	}
	
	//测试
	public static void main(String[] args) { 
		read();
	}
}
