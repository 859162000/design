package org.wanwanframework.flower.exception;

public class MeException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2442232291451464790L;

	public MeException() {
		super();
	}

	public MeException(String message) {
		super(message);
	}

	public MeException(String message, Throwable cause) {
		super(message, cause);
	}

	public MeException(Throwable cause) {
		super(cause);
	}
}
