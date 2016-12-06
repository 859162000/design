package com.wanwan.ai.util;

import java.util.List;

import com.wanwan.ai.core.ChessEntity;
import com.wanwan.ai.core.LearnController;

public class LearnUtil {
	
	private LearnController controller;
	
	public void search(ChessEntity chesser){
		controller.search();
	}

	/**
	 * 对棋谱进行搜索
	 * @param chesses
	 */
	public void search(List<Point> chesses){
		
	}
	
	/**
	 * 对棋谱进行学习
	 */
	public void learn(){
		
	}
}
