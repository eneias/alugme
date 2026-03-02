
namespace Alugme.Api.Domain;

public enum AppRole { Admin, Locador, Locatario }
public enum AppStatus { Pending, Active, Inactive }
public enum PropertyAvailability { Available, Rented, Maintenance }
public enum ContractStatus { Active, Completed, Cancelled }
public enum InspectionType { Entrada, Saida }
public enum InspectionStatus { PendingTenant, PendingLandlord, Disputed, Completed }
public enum BankAccountType { Corrente, Poupanca }
public enum UploadedByType { Landlord, Tenant }
