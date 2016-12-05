package start;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wanwan.ai.core.ChessEntity;
import com.wanwan.ai.service.EntityService;

public class AppTest {

	public static void main(String[] args) {
		String cfg = "applicationContext.xml";
		ApplicationContext ctx = new ClassPathXmlApplicationContext(cfg);
		System.out.println(ctx);
		EntityService service = (EntityService)ctx.getBean("entityService");
		System.out.println(service.find());
		 
	}
}
