// default package

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * Asset entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="FIN_ASSET"
    ,schema="EMS"
)

public class Asset  implements java.io.Serializable {


    // Fields    

     private AssetId id;


    // Constructors

    /** default constructor */
    public Asset() {
    }

    
    /** full constructor */
    public Asset(AssetId id) {
        this.id = id;
    }

   
    // Property accessors
    @EmbeddedId
    
    @AttributeOverrides( {
        @AttributeOverride(name="id", column=@Column(name="ID", nullable=false, precision=10, scale=0) ), 
        @AttributeOverride(name="classz", column=@Column(name="CLASSZ", nullable=false, length=50) ), 
        @AttributeOverride(name="classzNo", column=@Column(name="CLASSZ_NO", nullable=false, length=50) ), 
        @AttributeOverride(name="client", column=@Column(name="CLIENT", length=50) ), 
        @AttributeOverride(name="describe", column=@Column(name="DESCRIBE", length=50) ), 
        @AttributeOverride(name="status", column=@Column(name="STATUS", length=50) ), 
        @AttributeOverride(name="debtSubject", column=@Column(name="DEBT_SUBJECT", length=50) ), 
        @AttributeOverride(name="oldSubject", column=@Column(name="OLD_SUBJECT", length=50) ), 
        @AttributeOverride(name="disableDate", column=@Column(name="DISABLE_DATE", length=50) ), 
        @AttributeOverride(name="carNo", column=@Column(name="CAR_NO", length=50) ), 
        @AttributeOverride(name="mainNoDescribe", column=@Column(name="MAIN_NO_DESCRIBE", length=50) ), 
        @AttributeOverride(name="indexno", column=@Column(name="INDEXNO", length=50) ), 
        @AttributeOverride(name="oldStartDate", column=@Column(name="OLD_START_DATE", length=50) ), 
        @AttributeOverride(name="oldNo", column=@Column(name="OLD_NO", length=50) ), 
        @AttributeOverride(name="useAge", column=@Column(name="USE_AGE", length=50) ) } )

    public AssetId getId() {
        return this.id;
    }
    
    public void setId(AssetId id) {
        this.id = id;
    }
   








}