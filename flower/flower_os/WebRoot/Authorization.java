package ins.accfee.platform.schema.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

/**
 * 审批人临时授权信息表
 */
@Entity
@Table(name = "T_AUTHORIZATION")
public class Authorization implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7373602412264113806L;

	// Fields
	private String id;
	private String authorizerId;
	private String authorizedId;
	private Date authorizeTime;
	private String status;
	private Date effectiveDate;
	private Date expireDate;
	private double amount;
	private String authorizeModes;
	private String remarks;
	private Date confirmTime;
	private Date revokeTime;

	// Constructors

	/** default constructor */
	public Authorization() {
	}

	// Property accessors
	@Id
	@GenericGenerator(name = "systemUUID", strategy = "uuid")
	@GeneratedValue(generator = "systemUUID")
	@Column(name = "ID", unique = true, nullable = false, length = 32)
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "AUTHORIZER_ID", nullable = false, length = 30)
	public String getAuthorizerId() {
		return this.authorizerId;
	}

	public void setAuthorizerId(String authorizerId) {
		this.authorizerId = authorizerId;
	}

	@Column(name = "AUTHORIZED_ID", nullable = false, length = 30)
	public String getAuthorizedId() {
		return this.authorizedId;
	}

	public void setAuthorizedId(String authorizedId) {
		this.authorizedId = authorizedId;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "AUTHORIZE_TIME", nullable = false, length = 7)
	public Date getAuthorizeTime() {
		return this.authorizeTime;
	}

	public void setAuthorizeTime(Date authorizeTime) {
		this.authorizeTime = authorizeTime;
	}

	@Column(name = "STATUS", nullable = false, length = 1)
	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "EFFECTIVE_DATE", length = 7)
	public Date getEffectiveDate() {
		return this.effectiveDate;
	}

	public void setEffectiveDate(Date effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "EXPIRE_DATE", length = 7)
	public Date getExpireDate() {
		return this.expireDate;
	}

	public void setExpireDate(Date expireDate) {
		this.expireDate = expireDate;
	}

	@Column(name = "AMOUNT", nullable = false, precision = 16)
	public double getAmount() {
		return this.amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	@Column(name = "AUTHORIZE_MODES", length = 300)
	public String getAuthorizeModes() {
		return this.authorizeModes;
	}

	public void setAuthorizeModes(String authorizeModes) {
		this.authorizeModes = authorizeModes;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CONFIRM_TIME", length = 7)
	public Date getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Date confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "REVOKE_TIME", length = 7)
	public Date getRevokeTime() {
		return revokeTime;
	}

	public void setRevokeTime(Date revokeTime) {
		this.revokeTime = revokeTime;
	}

	@Column(name = "REMARKS", nullable = true, length = 3000)
	public String getRemarks() {
		return this.remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}