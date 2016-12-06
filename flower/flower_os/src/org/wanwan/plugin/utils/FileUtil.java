package org.wanwan.plugin.utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

/**
 * 文件操作工具类：包括文件读取、文件写、文件复制，等操作
 * @author Administrator
 *
 */
public class FileUtil{
	
	/**
	 * 拷贝一个文件
	 * @param source
	 * @param path
	 * @throws IOException
	 */
	public static void copy(String source, String path) throws IOException{
		FileInputStream fileInputStream = new FileInputStream(source);
		FileOutputStream fileOutputStream = new FileOutputStream(path + "copy");
		int readIndex = -1;
		while((readIndex = fileInputStream.read()) != -1){
			fileOutputStream.write(readIndex);
		}
		fileInputStream.close();
		fileOutputStream.close();
	}
	
	/**
	 * 读取一个文件的目录并返回这个目录的内容列表
	 * @param source
	 */
	public static String[] readDir(String source){
		File fileDir = new File(source);
		String[] list = null;
		if(fileDir.exists()){
			list = fileDir.list();
		}
		return list;
	}
	
	/**
	 * 创建一个文件，如果没有目录则创建一个目录
	 * @param dir
	 * @param content，创建文件的内容
	 */
	public static void createFile(String file, String dir, String content){
		try { 
			File f = new File(dir);
			f.mkdirs();
		
			BufferedWriter output = new BufferedWriter(new FileWriter(file));
			output.write(content);
			output.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 根据文件路径读取文件内容
	 * @param templateType
	 * @param filePath
	 * @param models
	 * @return
	 */
	public static String readFile(String filePath){ 
		String content = "";
		try { 
			Scanner in = new Scanner(new File(filePath));
			content = readText(in);
			in.close();
			return content; 
		} catch (FileNotFoundException e) { 
			e.printStackTrace();
		}
		return content;
	}
	 
	/**
	 * 将字节流中的字符组织成String
	 * @param in
	 * @param module
	 * @param file
	 * @return
	 */
	public static String readText(Scanner in){ 
		String content = ""; 
		while (in.hasNextLine()) {
			content = (content + in.nextLine() + "\r\n");
		}
		if(content.length() > 2){//当content读取到结果并长度大于2时，用于删除文件中的最后一个换行
			content = content.substring(0, content.length() - 2);	
		}
		return content; 	
	}
	 
	/**
	 * get the file template for per folder.
	 * @param fileTemplate
	 */
	public static String getTemplateFiles(String fileTemplate){
		String[] list = FileUtil.readDir(fileTemplate);
		String templateFiles = "";
		//remove the u.properties
		for (int i = 1; i < list.length; i++) {
			templateFiles += (list[i] + "/");
		}
		return templateFiles;
	}
	 
}
