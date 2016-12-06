    package com.spring.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.wanwan.plugin.utils.Log;

/** 
     * 切面 
     * 
     */  
    public class TimeAspect {  
      
        public void doAfter(JoinPoint jp) {  
        	Log.log("log Ending method: "  
                    + jp.getTarget().getClass().getName() + "."  
                    + jp.getSignature().getName());  
        }  
      
        public Object doAround(ProceedingJoinPoint pjp) throws Throwable {  
            long time = System.currentTimeMillis();  
            Object retVal = pjp.proceed();  
            time = System.currentTimeMillis() - time;  
            Log.log("process time: " + time + " ms");  
            return retVal;  
        }  
      
        public void doBefore(JoinPoint jp) {  
        	Log.log("log Begining method: "  
                    + jp.getTarget().getClass().getName() + "."  
                    + jp.getSignature().getName());  
        }  
      
        public void doThrowing(JoinPoint jp, Throwable ex) {  
            Log.log("method " + jp.getTarget().getClass().getName()  
                    + "." + jp.getSignature().getName() + " throw exception");  
            Log.log(ex.getMessage());  
        }   
    }   