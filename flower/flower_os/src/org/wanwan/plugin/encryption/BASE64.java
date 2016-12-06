package org.wanwan.plugin.encryption;

import java.io.IOException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
 
public class BASE64 {
	 
	public byte[] decoder(String text){
		BASE64Decoder decoder = new BASE64Decoder();
		try {
			return decoder.decodeBuffer(text);
		} catch (IOException e) { 
			e.printStackTrace();
		} 
		return null;
	}
	
	public String decode(byte[] bytes){
		BASE64Encoder encoder = new BASE64Encoder();
		return encoder.encode(bytes);
	}
}
