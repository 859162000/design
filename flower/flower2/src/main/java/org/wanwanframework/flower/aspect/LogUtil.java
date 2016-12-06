package org.wanwanframework.flower.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LogUtil {

	@Before("within(org.wanwan.flower.core..*)")
	@AfterReturning("within(org.wanwan.flower.core..*)")
	@After("within(org.wanwan.flower.core..*)")
	public void before() {
		System.out.println("前置通知, vvvv...");
	}

	@Around("within(org.wanwan.flower.core..*)")
	public Object around(ProceedingJoinPoint p) throws Throwable {
		System.out.println("环绕通知, 类名:" + p.getTarget().getClass().getName());
		System.out.println("环绕通知, 方法:" + p.getSignature().getName());
	
		Object obj = null;
		try {
			obj = p.proceed();
			System.out.println("oooooooo");
		} catch (Exception e) {
			StackTraceElement[] elems = e.getStackTrace();
			System.out.println(elems[0].toString());
		} finally {
			System.out.println("ProceedingJoinPoint-finally");
		}
		return obj;
	}

	@AfterThrowing(pointcut = "within(org.wanwan.flower.core..*)", throwing = "e")
	public void throwing(Exception e) {
		StackTraceElement[] elems = e.getStackTrace();
		System.out.println("例外通知: " + elems[0].toString());
	}

}
