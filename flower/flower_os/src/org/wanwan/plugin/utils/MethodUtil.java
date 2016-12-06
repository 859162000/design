package org.wanwan.plugin.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class MethodUtil {

	public static Object getClass(Object objcet, Class<?> classs) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException{
		Method getMethod = classs.getMethod("toString");
		return getMethod.invoke(objcet);
	}
	
	public Object getProperty(Object object, String field) throws Exception {   
	     Class<?> ownerClass = object.getClass();   
	     Field fieldz = ownerClass.getField(field);   
	     return fieldz.get(object);      
	}  
	
	public static void main(String[] args) {
		String test = "wo le g ...";
		try {
			Object obj = getClass(test, String.class);
			System.out.println("obj:" + obj);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
