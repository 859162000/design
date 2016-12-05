package com.wanwan.ai.util;

public class ChessUtil {

	/**
	 * 序列化一盘棋中的所有棋步
	 * @param points
	 * @return
	 */
	public String series(Point[] points){
		String content = "";
		for (int i = 0; i < points.length; i++) {
			content += series(points[i]);
		}
		return content;
	}
	
	/**
	 * 序列化其中一个棋步
	 * @param point
	 * @return
	 */
	public String series(Point point){
		return point.x + "," + point.y + ";";
	}
}
