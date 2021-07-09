export class WhitelistingModel {
  id: string;
  name: string;
  walletName: string;
  assetName: string;
  addressBase: string;
  addressExtension: string;
  createdAt: string;
  startsAt: string;
  status: string;

  constructor(dto: any) {
    this.id = dto.Id;
    this.name = dto.Name;
    this.walletName = dto.WalletName;
    this.assetName = dto.AssetName;
    this.addressBase = dto.AddressBase;
    this.addressExtension = dto.AddressExtension;
    this.createdAt = dto.CreatedAt;
    this.startsAt = dto.StartsAt;
    this.status = dto.Status;
  }
}

export default WhitelistingModel;
