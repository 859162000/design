package org.wanwan.flower.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.wanwan.plugin.utils.Log;

public class DateBean {

	public static void main(String[] args) throws ParseException {
		SimpleDateFormat sdf =   new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
		String dateString = "2016-07-13 08:20:01";
		Date date = sdf.parse(dateString);
		Log.log(date);
		Log.log(date.getTime());
	}
}
