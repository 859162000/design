package com.coco.entity;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

/**
 * A data access object (DAO) providing persistence and search support for TUser entities.
 * Transaction control of the save(), update() and delete() operations
 * can directly support Spring container-managed transactions or they can be augmented to handle user-managed Spring
 * transactions.
 * Each of these methods provides additional information for how to configure it for the desired type of transaction
 * control.
 * 
 * @see com.coco.entity.TUser
 * @author MyEclipse Persistence Tools
 */
public class TUserDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(TUserDAO.class);
	// property constants
	public static final String CODE = "code";
	public static final String NAME = "name";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";
	public static final String BANK_NAME = "bankName";
	public static final String BANK_ACCOUNT_NUM = "bankAccountNum";
	public static final String BANK_ACCOUNT_NAME = "bankAccountName";
	public static final String LOGON_MODE = "logonMode";
	public static final String LOGON_PASSWORD = "logonPassword";
	public static final String CREATOR_ID = "creatorId";
	public static final String MODIFIER_ID = "modifierId";
	public static final String REMARKS = "remarks";

	protected void initDao() {
		// do nothing
	}

	public void save(TUser transientInstance) {
		log.debug("saving TUser instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(TUser persistentInstance) {
		log.debug("deleting TUser instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public TUser findById(java.lang.Long id) {
		log.debug("getting TUser instance with id: " + id);
		try {
			TUser instance = (TUser) getHibernateTemplate().get("com.coco.entity.TUser", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(TUser instance) {
		log.debug("finding TUser instance by example");
		try {
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: " + results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding TUser instance with property: " + propertyName + ", value: " + value);
		try {
			String queryString = "from TUser as model where model." + propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByCode(Object code) {
		return findByProperty(CODE, code);
	}

	public List findByName(Object name) {
		return findByProperty(NAME, name);
	}

	public List findByEmail(Object email) {
		return findByProperty(EMAIL, email);
	}

	public List findByStatus(Object status) {
		return findByProperty(STATUS, status);
	}

	public List findByBankName(Object bankName) {
		return findByProperty(BANK_NAME, bankName);
	}

	public List findByBankAccountNum(Object bankAccountNum) {
		return findByProperty(BANK_ACCOUNT_NUM, bankAccountNum);
	}

	public List findByBankAccountName(Object bankAccountName) {
		return findByProperty(BANK_ACCOUNT_NAME, bankAccountName);
	}

	public List findByLogonMode(Object logonMode) {
		return findByProperty(LOGON_MODE, logonMode);
	}

	public List findByLogonPassword(Object logonPassword) {
		return findByProperty(LOGON_PASSWORD, logonPassword);
	}

	public List findByCreatorId(Object creatorId) {
		return findByProperty(CREATOR_ID, creatorId);
	}

	public List findByModifierId(Object modifierId) {
		return findByProperty(MODIFIER_ID, modifierId);
	}

	public List findByRemarks(Object remarks) {
		return findByProperty(REMARKS, remarks);
	}

	public List findAll() {
		log.debug("finding all TUser instances");
		try {
			String queryString = "from TUser";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public TUser merge(TUser detachedInstance) {
		log.debug("merging TUser instance");
		try {
			TUser result = (TUser) getHibernateTemplate().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(TUser instance) {
		log.debug("attaching dirty TUser instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(TUser instance) {
		log.debug("attaching clean TUser instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static TUserDAO getFromApplicationContext(ApplicationContext ctx) {
		return (TUserDAO) ctx.getBean("TUserDAO");
	}
}