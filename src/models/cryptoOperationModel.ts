export class CryptoOperationModel {
  id: string;
  name: string;
  displayId: string;
  accuracy: number;
  kycNeeded: boolean;
  bankCardsDepositEnabled: boolean;
  swiftDepositEnabled: boolean;
  blockchainDepositEnabled: boolean;
  categoryId: string;
  isBase: boolean;
  canBeBase: boolean;
  iconUrl: string;
  siriusBlockchainId: string;
  destinationTagLabel: string;

  constructor(dto: any) {
    this.id = dto.Id;
    this.name = dto.Name;
    this.displayId = dto.DisplayId;
    this.accuracy = dto.Accuracy;
    this.kycNeeded = dto.KycNeeded;
    this.bankCardsDepositEnabled = dto.BankCardsDepositEnabled;
    this.swiftDepositEnabled = dto.SwiftDepositEnabled;
    this.blockchainDepositEnabled = dto.BlockchainDepositEnabled;
    this.categoryId = dto.CategoryId;
    this.isBase = dto.IsBase;
    this.canBeBase = dto.CanBeBase;
    this.iconUrl = dto.IconUrl;
    this.siriusBlockchainId = dto.SiriusBlockchainId;
    this.destinationTagLabel = dto.DestinationTagLabel;
  }
}

export default CryptoOperationModel;
