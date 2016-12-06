package com.wanwan.ai.core;

import java.io.Serializable;

public class ChessEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * chess的每一局的id号
	 */
	private String id;
	
	/**
	 * chess的综合评分，确定搜索优先级
	 */
	private int score;
	
	/**
	 * chess对弈的主要棋步，没一步用分号隔开
	 */
	private String content;
	
	/**
	 * chess谁先，-1表示黑先，1表示白先
	 */
	private int first;
	
	/**
	 * chess谁赢，-1表示黑赢，1表示白赢，0表示和平
	 */
	private int success;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public int getFirst() {
		return first;
	}

	public void setFirst(int first) {
		this.first = first;
	}

	public int getSuccess() {
		return success;
	}

	public void setSuccess(int success) {
		this.success = success;
	}

	@Override
	public String toString() {
		return "Entity [id=" + id + ", score=" + score + ", content=" + content
				+ ", first=" + first + ", end=" + success + "]";
	}

}
