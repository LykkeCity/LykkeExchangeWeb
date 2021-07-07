export class WhitelistingModel {
  id: string;
  name: string;
  walletName: string;
  addressBase: string;
  addressExtension: string;
  createdAt: string;
  status: string;

  constructor(dto: any) {
    this.id = dto.Id;
    this.name = dto.Name;
    this.walletName = dto.walletName;
    this.addressBase = dto.AddressBase;
    this.addressExtension = dto.AddressExtension;
    this.createdAt = dto.CreatedAt;
    this.status = dto.Status;
  }
}

export default WhitelistingModel;
