// default package

import javax.persistence.Column;
import javax.persistence.Embeddable;


/**
 * AssetId entity. @author MyEclipse Persistence Tools
 */
@Embeddable

public class AssetId  implements java.io.Serializable {


    // Fields    

     private Long id;
     private String classz;
     private String classzNo;
     private String client;
     private String describe;
     private String status;
     private String debtSubject;
     private String oldSubject;
     private String disableDate;
     private String carNo;
     private String mainNoDescribe;
     private String indexno;
     private String oldStartDate;
     private String oldNo;
     private String useAge;


    // Constructors

    /** default constructor */
    public AssetId() {
    }

	/** minimal constructor */
    public AssetId(Long id, String classz, String classzNo) {
        this.id = id;
        this.classz = classz;
        this.classzNo = classzNo;
    }
    
    /** full constructor */
    public AssetId(Long id, String classz, String classzNo, String client, String describe, String status, String debtSubject, String oldSubject, String disableDate, String carNo, String mainNoDescribe, String indexno, String oldStartDate, String oldNo, String useAge) {
        this.id = id;
        this.classz = classz;
        this.classzNo = classzNo;
        this.client = client;
        this.describe = describe;
        this.status = status;
        this.debtSubject = debtSubject;
        this.oldSubject = oldSubject;
        this.disableDate = disableDate;
        this.carNo = carNo;
        this.mainNoDescribe = mainNoDescribe;
        this.indexno = indexno;
        this.oldStartDate = oldStartDate;
        this.oldNo = oldNo;
        this.useAge = useAge;
    }

   
    // Property accessors

    @Column(name="ID", nullable=false, precision=10, scale=0)

    public Long getId() {
        return this.id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    @Column(name="CLASSZ", nullable=false, length=50)

    public String getClassz() {
        return this.classz;
    }
    
    public void setClassz(String classz) {
        this.classz = classz;
    }

    @Column(name="CLASSZ_NO", nullable=false, length=50)

    public String getClasszNo() {
        return this.classzNo;
    }
    
    public void setClasszNo(String classzNo) {
        this.classzNo = classzNo;
    }

    @Column(name="CLIENT", length=50)

    public String getClient() {
        return this.client;
    }
    
    public void setClient(String client) {
        this.client = client;
    }

    @Column(name="DESCRIBE", length=50)

    public String getDescribe() {
        return this.describe;
    }
    
    public void setDescribe(String describe) {
        this.describe = describe;
    }

    @Column(name="STATUS", length=50)

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    @Column(name="DEBT_SUBJECT", length=50)

    public String getDebtSubject() {
        return this.debtSubject;
    }
    
    public void setDebtSubject(String debtSubject) {
        this.debtSubject = debtSubject;
    }

    @Column(name="OLD_SUBJECT", length=50)

    public String getOldSubject() {
        return this.oldSubject;
    }
    
    public void setOldSubject(String oldSubject) {
        this.oldSubject = oldSubject;
    }

    @Column(name="DISABLE_DATE", length=50)

    public String getDisableDate() {
        return this.disableDate;
    }
    
    public void setDisableDate(String disableDate) {
        this.disableDate = disableDate;
    }

    @Column(name="CAR_NO", length=50)

    public String getCarNo() {
        return this.carNo;
    }
    
    public void setCarNo(String carNo) {
        this.carNo = carNo;
    }

    @Column(name="MAIN_NO_DESCRIBE", length=50)

    public String getMainNoDescribe() {
        return this.mainNoDescribe;
    }
    
    public void setMainNoDescribe(String mainNoDescribe) {
        this.mainNoDescribe = mainNoDescribe;
    }

    @Column(name="INDEXNO", length=50)

    public String getIndexno() {
        return this.indexno;
    }
    
    public void setIndexno(String indexno) {
        this.indexno = indexno;
    }

    @Column(name="OLD_START_DATE", length=50)

    public String getOldStartDate() {
        return this.oldStartDate;
    }
    
    public void setOldStartDate(String oldStartDate) {
        this.oldStartDate = oldStartDate;
    }

    @Column(name="OLD_NO", length=50)

    public String getOldNo() {
        return this.oldNo;
    }
    
    public void setOldNo(String oldNo) {
        this.oldNo = oldNo;
    }

    @Column(name="USE_AGE", length=50)

    public String getUseAge() {
        return this.useAge;
    }
    
    public void setUseAge(String useAge) {
        this.useAge = useAge;
    }
   



   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof AssetId) ) return false;
		 AssetId castOther = ( AssetId ) other; 
         
		 return ( (this.getId()==castOther.getId()) || ( this.getId()!=null && castOther.getId()!=null && this.getId().equals(castOther.getId()) ) )
 && ( (this.getClassz()==castOther.getClassz()) || ( this.getClassz()!=null && castOther.getClassz()!=null && this.getClassz().equals(castOther.getClassz()) ) )
 && ( (this.getClasszNo()==castOther.getClasszNo()) || ( this.getClasszNo()!=null && castOther.getClasszNo()!=null && this.getClasszNo().equals(castOther.getClasszNo()) ) )
 && ( (this.getClient()==castOther.getClient()) || ( this.getClient()!=null && castOther.getClient()!=null && this.getClient().equals(castOther.getClient()) ) )
 && ( (this.getDescribe()==castOther.getDescribe()) || ( this.getDescribe()!=null && castOther.getDescribe()!=null && this.getDescribe().equals(castOther.getDescribe()) ) )
 && ( (this.getStatus()==castOther.getStatus()) || ( this.getStatus()!=null && castOther.getStatus()!=null && this.getStatus().equals(castOther.getStatus()) ) )
 && ( (this.getDebtSubject()==castOther.getDebtSubject()) || ( this.getDebtSubject()!=null && castOther.getDebtSubject()!=null && this.getDebtSubject().equals(castOther.getDebtSubject()) ) )
 && ( (this.getOldSubject()==castOther.getOldSubject()) || ( this.getOldSubject()!=null && castOther.getOldSubject()!=null && this.getOldSubject().equals(castOther.getOldSubject()) ) )
 && ( (this.getDisableDate()==castOther.getDisableDate()) || ( this.getDisableDate()!=null && castOther.getDisableDate()!=null && this.getDisableDate().equals(castOther.getDisableDate()) ) )
 && ( (this.getCarNo()==castOther.getCarNo()) || ( this.getCarNo()!=null && castOther.getCarNo()!=null && this.getCarNo().equals(castOther.getCarNo()) ) )
 && ( (this.getMainNoDescribe()==castOther.getMainNoDescribe()) || ( this.getMainNoDescribe()!=null && castOther.getMainNoDescribe()!=null && this.getMainNoDescribe().equals(castOther.getMainNoDescribe()) ) )
 && ( (this.getIndexno()==castOther.getIndexno()) || ( this.getIndexno()!=null && castOther.getIndexno()!=null && this.getIndexno().equals(castOther.getIndexno()) ) )
 && ( (this.getOldStartDate()==castOther.getOldStartDate()) || ( this.getOldStartDate()!=null && castOther.getOldStartDate()!=null && this.getOldStartDate().equals(castOther.getOldStartDate()) ) )
 && ( (this.getOldNo()==castOther.getOldNo()) || ( this.getOldNo()!=null && castOther.getOldNo()!=null && this.getOldNo().equals(castOther.getOldNo()) ) )
 && ( (this.getUseAge()==castOther.getUseAge()) || ( this.getUseAge()!=null && castOther.getUseAge()!=null && this.getUseAge().equals(castOther.getUseAge()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getId() == null ? 0 : this.getId().hashCode() );
         result = 37 * result + ( getClassz() == null ? 0 : this.getClassz().hashCode() );
         result = 37 * result + ( getClasszNo() == null ? 0 : this.getClasszNo().hashCode() );
         result = 37 * result + ( getClient() == null ? 0 : this.getClient().hashCode() );
         result = 37 * result + ( getDescribe() == null ? 0 : this.getDescribe().hashCode() );
         result = 37 * result + ( getStatus() == null ? 0 : this.getStatus().hashCode() );
         result = 37 * result + ( getDebtSubject() == null ? 0 : this.getDebtSubject().hashCode() );
         result = 37 * result + ( getOldSubject() == null ? 0 : this.getOldSubject().hashCode() );
         result = 37 * result + ( getDisableDate() == null ? 0 : this.getDisableDate().hashCode() );
         result = 37 * result + ( getCarNo() == null ? 0 : this.getCarNo().hashCode() );
         result = 37 * result + ( getMainNoDescribe() == null ? 0 : this.getMainNoDescribe().hashCode() );
         result = 37 * result + ( getIndexno() == null ? 0 : this.getIndexno().hashCode() );
         result = 37 * result + ( getOldStartDate() == null ? 0 : this.getOldStartDate().hashCode() );
         result = 37 * result + ( getOldNo() == null ? 0 : this.getOldNo().hashCode() );
         result = 37 * result + ( getUseAge() == null ? 0 : this.getUseAge().hashCode() );
         return result;
   }   





}