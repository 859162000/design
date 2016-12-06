package org.wanwanframework.flower.jms;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jms.JmsException;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;

/**
 * 鑷姩鍖栫洃鎺э細鍖呮嫭OGG鐘舵�鐩戞帶銆丄B搴撹〃绌洪棿鐩戞帶銆丄B搴撲复鏃惰〃绌洪棿鐩戞帶銆佽储鍔℃枃浠剁洃鎺�Created by Lironghai on
 * 2016-07-15.
 */
public class FortAutomationMonitor implements Processor {

	private final static Logger logger = LoggerFactory.getLogger(FortAutomationMonitor.class);
	private final static String QUERY_MAIL_LIST = "select * from (select t.*, rownum as rowno from (select * from moni_result_mail a where a.create_time not in (select create_time from moni_result_mail_his b)) t where rownum <= ?) account where account.rowno >= ?";
	private final static String QUERY_MAIL_COUNT = "select count(0) from moni_result_mail a where a.create_time not in (select create_time from moni_result_mail_his b)";

	private final static String INSERT_MAIL_HIS = "insert into moni_result_mail_his(moni_id, desaddr, subject, content, create_time, deal_time) values(?, ?, ?, ?, ?, ?)";

	private JdbcTemplate jdbcTemplate;
	private JmsTemplate jmsTemplate;

	private int pageSize = 1000; // 鍒嗛〉澶у皬

	/**
	 * 鍙戦�閭欢娑堟伅
	 * 
	 * @param emailList
	 */
	private List<Object[]> sendList(List<Object[]> list) {
		List<Object[]> sentList = new ArrayList<Object[]>();
		Map<String, EmailBean> map = new HashMap<String, EmailBean>();
		for (int i = 0; i < list.size(); i++) {
			sentList.add(createEmail(list.get(i), map));// 缁勮涓�潯鏁版嵁
		}
		try {
			for (String address : map.keySet()) {
				final EmailBean emailBeanObject = map.get(address);
				emailBeanObject.setContent(mailTableTemplate(emailBeanObject.getContent()));
				logger.info("EmailBean" + emailBeanObject);
				jmsTemplate.send("q.emailQueue", new MessageCreator() {
					@Override
					public Message createMessage(Session session) throws JMSException {
						return session.createObjectMessage(emailBeanObject);
					}
				});
			}
			map.clear();
		} catch (JmsException e) {
			logger.error("fail to send message,msg info:", e);
			sentList.clear(); // 娑堟伅鍙戦�澶辫触, 鍒欒繖鏉¤褰曚笉淇濆瓨
		}
		return sentList;
	}

	/**
	 * 鐩戞帶淇℃伅鏇存柊鍒板巻鍙茶褰曡〃
	 * 
	 */
	private void saveHistory(String sql, List<Object[]> fieldList) {
		if (fieldList == null) {
			return;
		}
		final List<Object[]> fields = fieldList;
		final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				Object[] history = fields.get(i);// 鍘嗗彶璁板綍
				if (Integer.parseInt(history[0].toString()) > 0) {
					int monitorId = Integer.parseInt(history[0].toString());
					ps.setInt(1, monitorId);
					ps.setString(2, history[1].toString());
					ps.setString(3, history[2].toString());
					ps.setString(4, history[3].toString());
					try {
						long time = sdf.parse(fields.get(i)[4].toString()).getTime();
						ps.setTimestamp(5, new Timestamp(time));// create_time
					} catch (ParseException e) {
						e.printStackTrace();
					}
					ps.setTimestamp(6, new Timestamp(System.currentTimeMillis()));// deal_time
				}

			}

			@Override
			public int getBatchSize() {
				return fields.size();
			}

		});
		fieldList = null;
	}

	private Object[] createEmail(Object[] data, Map<String, EmailBean> map) {
		EmailBean email;
		String[] addresses = data[1].toString().split(";");
		String subject = data[2].toString();
		String content = getContent(data);

		for (int j = 0; j < addresses.length; j++) {
			email = new EmailBean();
			email.setSubject(subject);
			email.setContent(content);
			email.setDesAddr(addresses[j]);
			if (!map.containsKey(email.getDesAddr())) {
				map.put(email.getDesAddr(), email);
			} else {
				email.setContent(map.get(email.getDesAddr()).getContent() + email.getContent());
				map.put(email.getDesAddr(), email);
			}
		}
		return data;
	}

	private String getContent(Object[] data) {
		String content = "<tr><td>" + data[3] + "</td><td>" + data[4] + "</td></tr>";
		return content;
	}

	/*
	 * 缁勬垚琛ㄦ牸鐨勫舰寮忓彂閫侀偖浠�
	 */
	private String mailTableTemplate(String mailContent) {
		String cssContent = "<style type='text/css'>table.mystyle"
				+ "{border-width: 0 0 1px 1px;border-spacing: 0;border-collapse: collapse;border-style: solid;}"
				+ ".mystyle td, .mystyle th"
				+ "{    margin: 0;    padding: 4px;    border-width: 1px 1px 0 0;    border-style: solid;}"
				+ "</style>";
		String htmlConent = cssContent + "<table class='mystyle'><tr><td>闂鎻忚堪</td><td>闂鏃堕棿</td></tr>" + mailContent + "</table>";
		return htmlConent;
	}

	/**
	 * 鏌ヨ寰呭鐞嗘暟鎹�鏁�
	 * 
	 * @return
	 */
	private Integer queryCount() {
		Integer count = jdbcTemplate.queryForObject(QUERY_MAIL_COUNT, java.lang.Integer.class);
		return count;
	}

	private List<Object[]> queryMail(String sql, String[] fields, int pageNumber) {
		final int start = pageNumber * pageSize + 1;
		final int end = (pageNumber + 1) * pageSize;
		final String[] fieldz = fields;
		List<Object[]> list = jdbcTemplate.query(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setInt(1, end);
				ps.setInt(2, start);
			}
		}, new RowMapper<Object[]>() {

			@Override
			public Object[] mapRow(ResultSet rs, int rowNum) throws SQLException {
				Object[] objects = new Object[fieldz.length];
				for (int i = 0; i < fieldz.length - 1; i++) {
					objects[i] = rs.getString(fieldz[i]);// 渚濇灏嗘暟鎹簱閲岀殑鏁版嵁浠tring绫诲瀷鏀惧埌鏁扮粍閲岄潰
				}
				objects[fieldz.length - 1] = rs.getString(fieldz[fieldz.length - 1]);
				return objects;
			}
		});
		return list;
	}

	/**
	 * 澶勭悊姣忎竴椤电殑鎯呭喌
	 * 
	 * @param pageNumber
	 */
	private void processPage(int pageNumber) {
		logger.info("monitor begin...");
		List<Object[]> list = queryMail(QUERY_MAIL_LIST,
				new String[] { "moni_id", "desAddr", "subject", "content", "create_time" }, pageNumber);

		saveHistory(INSERT_MAIL_HIS, sendList(list));
	}

	@Override
	public void process(Exchange exchange) throws Exception {
		int total = queryCount();
		int pageCount = total / this.pageSize + 1;
		for (int i = 0; i < pageCount; i++) {
			processPage(i);
		}
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void setJmsTemplate(JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

}
